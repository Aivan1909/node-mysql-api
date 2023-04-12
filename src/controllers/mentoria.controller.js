import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';


const addMentorias = async (req, res) => {
  try {
    //Mentores 
    const bkMentor = req.body.mentor
    delete req.body.mentor

    const bkArea = req.body.area
    delete req.body.area
    //Emprendimiento
    const bkEmprendimiento = req.body.emprendimiento
    delete req.body.emprendimiento

    const mentoria = req.body;
    mentoria.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    mentoria.estado = 1;
    let tipo = mentoria.tipo;
    const connection = await getConnection();
    let result = await connection.query(`INSERT INTO tmunay_mentorias SET ?`, mentoria);

    const { insertId } = await result;

    //Generando  el  codigo de tipo de Mentoria

    let cod = insertId.toString();
    let codigo;
    if (tipo == 'D') {
      codigo = 'D-'.concat(cod.padStart(7, 0))
    }
    if (tipo == 'E') {
      codigo = 'E-'.concat(cod.padStart(7, 0))
    }
    await connection.query(`UPDATE tmunay_mentorias  SET tipo = ? WHERE id =?`, [codigo, insertId]);

    //Insertando  el id Relacional Mentores
    for (element of bkMentor) {
      const idExternaMentor = {
        mentorias_id: insertId,
        mentores_id: element
      };
      //console.log("IDS->externos ->" , idExternaMentor)
      await connection.query(`INSERT INTO mentoria_mentor SET ?`, idExternaMentor);
    };
    //Insertando  el id Relacional Areas
    for (element of bkArea) {
      const idExternaArea = {
        mentoria_id: insertId,
        area_id: element
      };
      //console.log("IDS->externos ->" , idExternaArea)
      await connection.query(`INSERT INTO area_mentoria SET ?`, idExternaArea);
    };

    //Insertando  el id Relacional Emprendimiento
    /* for (element of bkEmprendimiento) {
      const idExternaEmprendimiento = {
        mentorias_id: insertId,
        emprendimiento_id: element
      };
      //console.log("IDS->externos ->", idExternaEmprendimiento)
      await connection.query(`INSERT INTO ${_TABLA4} SET ?`, idExternaEmprendimiento);
    }; */

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentorias = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_mentorias`);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentoria = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_mentorias WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentoriasUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_mentores WHERE user_id = ?`, id);
    if (!result.length > 0) return res.status(404);

    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const getMentoriasEmprendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      `SELECT me.*
      FROM tmunay_mentorias me, tmunay_emprendimientos em
      WHERE me.emprendimiento_id=em.id and em.user_id=?`
      , id);

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const getMentoriasGrupo = async (req, res) => {
  const { tipo, mentoria, mentor } = req.params;

  try {
    const connection = await getConnection();

    let sql = `SELECT xu.id, xm.id as mentor_id , concat(xu.nombre,' ', xu.apellidos) as nombres, xm.curriculum, xm.estado
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
      let predicado2 = [mentor_id]

      if (typeof (tipo) != 'undefined' && tipo != '' && tipo != '0') {
        sql2 += " AND ar.tipo = ?"
        predicado2.push(tipo)
      }
      const mentorias = await connection.query(sql2, predicado2);

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

      console.log(mentor_id, fechasMentoriaUnique.length > 0, mentorias.length > 0)
      if (fechasMentoriaUnique.length > 0 && mentorias.length > 0)
        resultF.push({ mentores: iterator, mentorias, fechasMentoria: fechasMentoriaUnique })
    }

    await res.json({ body: resultF });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const updateMentoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, codigoTel, telefono, mensaje, usuarioModificacion } = req.body;
    if (user_id === undefined) return res.status(400).json({ message: 'Bad Request' });
    const mentoria = { nombre, apellido, correo, codigoTel, telefono, mensaje, usuarioModificacion };
    mentoria.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_mentorias SET ? WHERE id=?`, [mentoria, id]);
    const foundmentoria = await connection.query(`SELECT * FROM tmunay_mentorias WHERE id=?`, id);
    res.json({ body: foundmentoria[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteMentoria = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_mentorias WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

//PENDIENTE
const solicitudMentorias = async (req, res) => {
  try {
    //Mentores 
    const bkMentor = req.body.mentor
    delete req.body.mentor

    const bkArea = req.body.area
    delete req.body.area
    //Emprendimiento
    const bkEmprendimiento = req.body.emprendimiento
    delete req.body.emprendimiento

    const mentoria = req.body;
    mentoria.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    mentoria.estado = 1;
    let tipo = mentoria.tipo;
    const connection = await getConnection();
    let result = await connection.query(`INSERT INTO tmunay_mentorias SET ?`, mentoria);

    const { insertId } = await result;

    //Generando  el  codigo de tipo de Mentoria

    let cod = insertId.toString();
    let codigo;
    if (tipo == 'D') {
      codigo = 'D-'.concat(cod.padStart(7, 0))
    }
    if (tipo == 'E') {
      codigo = 'E-'.concat(cod.padStart(7, 0))
    }
    await connection.query(`UPDATE tmunay_mentorias  SET tipo = ? WHERE id =?`, [codigo, insertId]);

    //Insertando  el id Relacional Mentores
    await bkMentor.forEach(element => {
      const idExternaMentor = {
        mentorias_id: insertId,
        mentores_id: element
      };
      //console.log("IDS->externos ->" , idExternaMentor)
      connection.query(`INSERT INTO mentoria_mentor SET ?`, idExternaMentor);
    });
    //Insertando  el id Relacional Horarios
    //Insertando  el id Relacional Areas
    await bkArea.forEach(element => {
      const idExternaArea = {
        mentoria_id: insertId,
        area_id: element
      };
      //console.log("IDS->externos ->" , idExternaArea)
      connection.query(`INSERT INTO area_mentoria SET ?`, idExternaArea);
    });

    //Insertando  el id Relacional Emprendimiento
    /* await bkEmprendimiento.forEach(element => {
      const idExternaEmprendimiento = {
        mentorias_id: insertId,
        emprendimiento_id: element
      };
      console.log("IDS->externos ->", idExternaEmprendimiento)
      connection.query(`INSERT INTO ${_TABLA4} SET ?`, idExternaEmprendimiento);
    }); */

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};


export const methods = {
  addMentorias,
  getMentorias,
  getMentoria,
  getMentoriasUsuario,
  getMentoriasEmprendedor,
  getMentoriasGrupo,
  updateMentoria,
  deleteMentoria,
};
