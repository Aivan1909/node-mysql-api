import { getConnection } from '../database/database';
import { SaveOneFile, deleleFolder, getOneFile, updateOneFile } from '../middleware/upload';
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const moment = require("moment")
const config = require('../config');

/* Funcion que agrega los mentores  */
const addMentores = async (req, res) => {
  try {
    //Recuperar el Usuario para completar el  formulario[revision]
    const { user_id, curriculum, institucion_id, usuarioCreacion } = req.body
    const { canal } = req.body
    const mentor = { user_id: desencryptar(user_id), curriculum, institucion_id, usuarioCreacion };
    mentor.fechaCreacion = moment().format(config.formats.dateTime);
    mentor.online = canal?.length == 2 ? 0 : canal[0];
    mentor.estado = 2;

    // Insertando datos de mentor
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_mentores SET ?`, mentor);

    const { insertId } = await result;
    const path = await SaveOneFile({ mainFolder: 'mentor', idFolder: insertId, file: req.file, targetSize: 400 });
    await connection.query(`UPDATE tmunay_mentores SET imagen=? WHERE id=?`, [path, insertId]);


    // Insertando las especialidades
    const { areas } = req.body
    for (const area of JSON.parse(areas)) {
      const dicta = { especialidad_id: area, mentor_id: insertId }
      connection.query(`INSERT INTO dicta_mentoria SET ?`, dicta);
    }

    // Insertando los horarios
    const { horarios } = req.body
    for (const horario of JSON.parse(horarios)) {
      const nuevoHorario = { dia_id: horario.dia_id, hora_inicio: horario.hora_inicio, hora_fin: horario.hora_fin, mentores_id: insertId }
      connection.query(`INSERT INTO horario_mentor SET ?`, nuevoHorario);
    }

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`
    SELECT us.nombre, us.apellidos, us.email, us.sexo, us.pais, us.codigoTel, us.telefono, us.nick, me.*
    , CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
    FROM users us, tmunay_instituciones ins, tmunay_mentores me
    LEFT JOIN users usc ON me.usuarioCreacion=usc.id
    LEFT JOIN users usm ON me.usuarioModificacion=usm.id
    WHERE me.user_id=us.id and ins.id=me.institucion_id AND me.id=?`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });

    const mentor = result[0]
    mentor.imagen = getOneFile(mentor.imagen)
    mentor.id = encryptar(mentor.id)
    mentor.user_id = encryptar(mentor.user_id)

    res.json({ body: mentor });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getMentores = async (req, res) => {
  try {
    const connection = await getConnection();
    const reMentores = await connection.query(`
    SELECT us.nombre, us.apellidos, us.email, us.sexo, us.pais, us.codigoTel, us.telefono, us.nick, me.*
    , CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
    FROM users us, tmunay_instituciones ins, tmunay_mentores me
    LEFT JOIN users usc ON me.usuarioCreacion=usc.id
    LEFT JOIN users usm ON me.usuarioModificacion=usm.id
    WHERE me.user_id=us.id and ins.id=me.institucion_id`);

    for (const mentor of reMentores) {
      const reEspecialidades = await connection.query(`SELECT es.nombre
      FROM tmunay_mentores me, dicta_mentoria dm, tmunay_especialidad es
      WHERE me.id=dm.mentor_id AND dm.especialidad_id=es.id and me.id=?`, mentor.id)

      mentor.especialidades = reEspecialidades.map((item) => item.nombre)

      const reHorarios = await connection.query(`SELECT di.descripcion, di.abreviacion, hm.* 
      FROM horario_mentor hm, tmunay_dias di 
      WHERE hm.dia_id=di.id and hm.mentores_id=?`, mentor.id)

      mentor.horarios = reHorarios
    }

    const reMentoresImage = [...reMentores].map((item) => {
      return { ...item, imagen: getOneFile(item.imagen), id: encryptar(item.id), user_id: encryptar(item.user_id) };
    });

    res.json({ body: reMentoresImage });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { curriculum, user_id, tipo, usuarioModificacion } = req.body;
    if (user_id === undefined) return res.status(400).json({ message: 'Bad Request' });
    const mentors = { curriculum, user_id: desencryptar(user_id), tipo, usuarioModificacion };
    mentors.fechaModificacion = moment().format(config.formats.dateTime);

    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_mentores SET ? WHERE id=?`, [mentors, id]);

    const foundmentors = await connection.query(`SELECT * FROM tmunay_mentores WHERE id=?`, id);

    if (req.files) {
      const imagen = [...req.files].filter((item) => item.fieldname === 'imagen')[0];
      const responseUpdateImagen = imagen && await updateOneFile({ pathFile: foundmentors[0].imagen, file: imagen, targetSize: 400 });

      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_mentores SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
    }

    res.json({ body: foundmentors[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_mentores WHERE id=?`, id);

    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const eliminaMentor = async (req, res) => {
  try {
    const { id } = req.body;
    const idMentor = desencryptar(id)

    const connection = await getConnection();
    const foundItem = await connection.query(`SELECT * from tmunay_mentores WHERE id=?`, idMentor);
    if (foundItem[0]?.estado == 0) {
      await deleleFolder(foundItem[0].imagen);
      await connection.query(`DELETE FROM tmunay_mentores WHERE id=?`, idMentor);
    } else {
      await connection.query(`UPDATE tmunay_mentores SET estado=0 WHERE id=?`, idMentor);
    }

    res.json({ body: foundItem[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

//Muestreo de Mentores con sus mentorias y  horarios 
const getMentoresMuestreos = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql = `SELECT xu.id, xm.id as mentor_id , concat(xu.nombre,' ', xu.apellidos) as nombres, xm.curriculum, xm.estado, xu.nick
              FROM tmunay_mentores xm, users xu 
              where xm.user_id = xu.id and xm.estado = 1`;
    const mentores = await connection.query(sql);

    let resultF = [];
    for (const iterator of mentores) {
      const { mentor_id } = iterator;
      let sql1 = `SELECT hm.id, hm.hora_inicio, hm.hora_fin, hm.dia_id, d.abreviacion
      FROM horario_mentor hm, tmunay_dias d
      WHERE hm.dia_id = d.id and hm.mentores_id= ?`
      const dias = await connection.query(sql1, mentor_id);

      let sql2 = `SELECT esp.areas_id, ar.nombre, dm.especialidad_id, esp.nombre
      FROM dicta_mentoria dm, tmunay_especialidad esp, tmunay_areas ar
      WHERE dm.especialidad_id = esp.id and esp.areas_id = ar.id and dm.mentor_id = ?`
      const mentorias = await connection.query(sql2, mentor_id);

      var fechasMentoria = [];

      for (const diasMentorias of dias) {
        const { id, abreviacion, hora_inicio, hora_fin } = diasMentorias;
        const m = require('moment')
        let diaHoy = m().isoWeekday();
        let v1;
        let diaBase = abreviacion;
        //console.log('diahoy: ', diaHoy, ' diaBase: ', diaBase)
        v1 = (7 - diaHoy + diaBase);
        if (v1 >= 7) {
          v1 = v1 - 7;
        }
        let fecha = m().add(v1, 'days');
        fechasMentoria.push({ id, fecha: fecha.format("YYYY/MM/DD"), hora1: hora_inicio, hora2: hora_fin });

        for (let i = 0; i < 3; i++) {
          let f = m(fecha).add(7, 'days');
          fechasMentoria.push({ id, fecha: f.format("YYYY/MM/DD"), hora1: hora_inicio, hora2: hora_fin });
        };
      }

      // Eliminamos duplicados
      let fechasMentoriaUnique = await fechasMentoria.reduce(
        (unique, o) => {
          if (
            !unique.some(
              (obj) =>
                obj.fecha == o.fecha &&
                obj.hora1 == o.hora1 &&
                obj.hora2 == o.hora2
            )
          ) {
            unique.push(o);
          }
          return unique;
        },
        []
      );

      if (fechasMentoriaUnique.length > 0 && mentorias.length > 0)
        resultF.push({ 'mentores': iterator, mentorias, fechasMentoria: fechasMentoriaUnique })
    }

    await res.json({ body: resultF });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMentoresArea = async (req, res) => {
  try {
    // TODO: FALTA TRABJARLO
    const { linkArea } = req.params;

    const connection = await getConnection();
    let sql = `SELECT xu.id, xm.id as mentor_id , concat(xu.nombre,' ', xu.apellidos) as nombres, xm.curriculum, xm.estado, xu.nick
              FROM tmunay_mentores xm, users xu 
              where xm.user_id = xu.id and xm.estado = 1`;
    const mentores = await connection.query(sql);

    let resultF = [];
    for (const iterator of mentores) {
      const { mentor_id } = iterator;
      let sql1 = `SELECT hm.id, hm.hora_inicio, hm.hora_fin, hm.dia_id, d.abreviacion
      FROM horario_mentor hm, tmunay_dias d
      WHERE hm.dia_id = d.id and hm.mentores_id= ?`
      const dias = await connection.query(sql1, mentor_id);
      /* let sql1 = `SELECT xd.mentor_id , hm.hora_inicio as hora1Mentoria, hm.hora_fin as hora2Mentoria, 
      xt.nombre as nombreArea, xe.nombre as nombreEspecialidad,xm.estado 
      FROM dicta_mentoria xd, tmunay_mentores xm , tmunay_especialidad xe, tmunay_areas xt, horario_mentor hm
      WHERE xd.mentor_id = xm.id and xd.especialidad_id = xe.id and xe.areas_id = xt.id and hm.mentores_id=xd.mentor_id and xd.mentor_id = ?`; */

      let sql2 = `SELECT esp.areas_id, ar.nombre, dm.especialidad_id, esp.nombre
      FROM dicta_mentoria dm, tmunay_especialidad esp, tmunay_areas ar
      WHERE dm.especialidad_id = esp.id and esp.areas_id = ar.id and dm.mentor_id = ?`
      const mentorias = await connection.query(sql2, mentor_id);

      var fechasMentoria = [];

      for (const diasMentorias of dias) {
        const { id, abreviacion, hora_inicio, hora_fin } = diasMentorias;
        const m = require('moment')
        let diaHoy = m().isoWeekday();
        let v1;
        let diaBase = abreviacion;
        //console.log('diahoy: ', diaHoy, ' diaBase: ', diaBase)
        v1 = (7 - diaHoy + diaBase);
        if (v1 >= 7) {
          v1 = v1 - 7;
        }
        let fecha = m().add(v1, 'days');
        fechasMentoria.push({ id, fecha: fecha.format("YYYY/MM/DD"), hora1: hora_inicio, hora2: hora_fin });

        for (let i = 0; i < 3; i++) {
          let f = m(fecha).add(7, 'days');
          fechasMentoria.push({ id, fecha: f.format("YYYY/MM/DD"), hora1: hora_inicio, hora2: hora_fin });
        };
      }

      // Eliminamos duplicados
      let fechasMentoriaUnique = await fechasMentoria.reduce(
        (unique, o) => {
          if (
            !unique.some(
              (obj) =>
                obj.fecha == o.fecha &&
                obj.hora1 == o.hora1 &&
                obj.hora2 == o.hora2
            )
          ) {
            unique.push(o);
          }
          return unique;
        },
        []
      );

      if (fechasMentoriaUnique.length > 0 && mentorias.length > 0)
        resultF.push({ 'mentores': iterator, mentorias, fechasMentoria: fechasMentoriaUnique })
    }

    await res.json({ body: resultF });
  } catch (error) {
    console.log('Este es el error', error)
    res.status(500).json(error.message);
  }
}
const getMentorId = async (req, res) => {
  try {
    const { id } = req.body;
    const idd = desencryptar(id)

    const connection = await getConnection();
    const result = await connection.query(`
    SELECT us.nombre, us.apellidos, us.email, us.sexo, us.pais, us.codigoTel, us.telefono, us.nick, me.*
    , CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
    FROM users us, tmunay_instituciones ins, tmunay_mentores me
    LEFT JOIN users usc ON me.usuarioCreacion=usc.id
    LEFT JOIN users usm ON me.usuarioModificacion=usm.id
    WHERE me.user_id=us.id and ins.id=me.institucion_id AND me.user_id=?`, idd);

    const mentor = result[0]

    mentor.imagen = getOneFile(mentor?.imagen)

    mentor.areas = await connection.query(`
      SELECT DISTINCT tmar.id, tmar.nombre, tmar.descripcionArea, tmar.link, tmar.tipo, tmar.estado
      FROM dicta_mentoria xdm, tmunay_especialidad tmes, tmunay_areas tmar
      WHERE tmes.areas_id=tmar.id AND xdm.especialidad_id=tmes.id AND xdm.mentor_id=?`, mentor.id)

    mentor.especialidades = await connection.query(`
      SELECT tmes.id, tmes.nombre, tmes.descripcion, tmes.link, tmes.estado
      FROM dicta_mentoria xdm, tmunay_especialidad tmes
      WHERE xdm.especialidad_id=tmes.id AND xdm.mentor_id=?`, mentor.id)

    mentor.horarios = await connection.query(`
      SELECT xhm.*, tmdi.descripcion dia_descripcion
      FROM horario_mentor xhm, tmunay_dias tmdi
      WHERE xhm.dia_id=tmdi.id AND xhm.mentores_id=?`, mentor.id)

    mentor.mentorias = await connection.query(`
      SELECT tmem.emprendimiento, tmme.asistencia, tmme.hora_inicio, tmme.hora_fin, tmar.nombre nombre_area, tmar.tipo tipo_area
      , tmme.codigo, tmme.fechaMentoria
      FROM tmunay_emprendimientos tmem, tmunay_mentorias tmme, tmunay_especialidad tmes, dicta_mentoria xdm, tmunay_areas tmar
      WHERE tmar.id=tmes.areas_id AND tmem.id=tmme.emprendimiento_id AND tmme.especialidad_id=tmes.id AND xdm.especialidad_id=tmes.id AND xdm.mentor_id=?`, mentor.id)

    mentor.medallas = await connection.query(`
      SELECT tmmn.*
      FROM tmunay_medallasnanay tmmn, medallas_nanay xmn
      WHERE tmmn.id = xmn.medallas_id AND xmn.mentores_id=?
      ORDER BY xmn.id
    `, mentor.id)

    mentor.id = encryptar(mentor.id)
    mentor.user_id = encryptar(mentor.user_id)

    res.json({ body: mentor });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const getMentoresMuestreo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    let sql = `SELECT xu.id,xm.id as mentor_id , concat(xu.nombre,' ', xu.apellidos) as nombres, 
              xm.curriculum, xm.dia, xm.hora1, xm.hora2,xm.duracion, xm.estado, xm.tipo , xm.online, xu.nick
              FROM tmunay_mentores xm, users xu 
              where xm.user_id = xu.id and xm.id = ?`;
    const mentores = await connection.query(sql, id);

    let resultF = [];
    for (const iterator of mentores) {
      const { mentor_id } = iterator;
      const { dia } = iterator;
      let sql1 = `SELECT xm.id as mentoria_id,xd.mentor_id ,xm.codigo, concat(xm.nombre,' ', xm.apellido) as nombreResp, xm.correo, 
      concat(codigoTel,' ',telefono) as telefonoResp, xm.fechaMentoria, xm.hora1 as hora1Mentoria, xm.hora2 as hora2Mentoria, xm.flg_mensaje, 
      xm.mensaje, xt.nombre as nombreArea, xe.nombre as nombreEspecialidad,xm.estado 
      FROM dicta_mentoria xd, tmunay_mentorias xm , tmunay_especialidad xe, tmunay_areas xt  
      WHERE xd.mentor_id = xm.id and xd.especialidad_id = xe.id and xe.areas_id = xt.id and xd.mentor_id  = ?`;
      const mentoria = await connection.query(sql1, mentor_id);

      for (const iteratorMeto of mentoria) {
        let fechasMentoria = [];
        const m = require('moment')
        let diaHoy = m().isoWeekday();
        let v1;
        let diaBase = dia;
        console.log('diahoy: ', diaHoy, ' diaBase: ', diaBase)
        v1 = (7 - diaHoy + diaBase);
        if (v1 >= 7) {
          v1 = v1 - 7;
        }
        let fecha = m().add(v1, 'days');
        console.log('fecha0: ', fecha)
        fechasMentoria.push(fecha);

        for (let i = 0; i < 3; i++) {
          let f = m(fecha).add(7, 'days');
          fecha = f;
          fechasMentoria.push(f);
        };

        resultF.push({ 'mentores': iterator, 'mentorias': iteratorMeto, 'fechasMentoria': fechasMentoria })
      }
    }

    await res.json({ body: resultF });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


export const methods = {
  addMentores,
  getMentores,
  updateMentor,
  deleteMentor,

  eliminaMentor,

  getMentoresMuestreos,
  getMentoresArea,
  getMentor,
  getMentorId,
  getMentoresMuestreo,
};
