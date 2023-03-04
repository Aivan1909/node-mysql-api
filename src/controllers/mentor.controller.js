import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_mentores';
const _TABLA1 = 'tmunay_mentorias';
const _TABLA2 = 'tmunay_areas'; 
const _TABLA3 = 'especialidad_mentor';
const _TABLA5 = 'users';
const _TABLA7 = 'tmunay_especialidad';
const _TABLA8 = 'dicta_mentoria';



const addMentores = async (req, res) => {
  try {
    //Recuperar el Usuario para completar el  formulario[revision]

    const bkEspecialidad = req.body.especialidad
    delete req.body.especialidad

    const mentor = req.body;
    mentor.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, mentor);

    const { insertId} =  await result;
 
    //Insertando  el id  especialidad
    await bkEspecialidad.forEach (element => {
    const  idExternaEspecialidad  = {
        mentor_id: insertId,
        especialidad_id: element
        } ;
        connection.query(`INSERT INTO ${_TABLA3} SET ?`, idExternaEspecialidad);
     });

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

//Muestreo de Mentores con sus mentorias y  horarios 
const getMentoresMuestreos = async (req, res) => {
  try {
    //const { id } = req.params;
    const connection = await getConnection();
    
    let sql = `SELECT xu.id,xm.id as mentor_id , concat(xu.nombre,' ', xu.apellidos) as nombres, 
              xm.curriculum, xm.dia, xm.hora1, xm.hora2,xm.duracion, xm.estado, xm.tipo , xm.online
              FROM ${_TABLA} xm, ${_TABLA5} xu 
              where xm.user_id = xu.id`;
    const mentores = await connection.query(sql);

    let resultF = [];
    for (const iterator of mentores) {
      const { mentor_id } = iterator;
      const { dia } = iterator;
      let sql1 = `SELECT xm.id as mentoria_id,xd.mentor_id ,xm.codigo, concat(xm.nombre,' ', xm.apellido) as nombreResp, xm.correo, 
      concat(codigoTel,' ',telefono) as telefonoResp, xm.fechaMentoria, xm.hora1 as hora1Mentoria, xm.hora2 as hora2Mentoria, xm.flg_mensaje, 
      xm.mensaje, xt.nombre as nombreArea, xe.nombre as nombreEspecialidad,xm.estado 
      FROM ${_TABLA8} xd, ${_TABLA1} xm , ${_TABLA7} xe, ${_TABLA2} xt  
      WHERE xd.mentor_id = xm.id and xd.especialidad_id = xe.id and xe.areas_id = xt.id and xd.mentor_id  = ?`;
      const mentoria = await connection.query(sql1, mentor_id);
     
      for (const iteratorMeto of mentoria) {
       let  fechasMentoria = [];
       const m =  require('moment')
       let diaHoy = m().isoWeekday();
       let v1;
       let  diaBase = dia; 
      console.log('diahoy: ', diaHoy, ' diaBase: ', diaBase)
        v1 = (7 - diaHoy + diaBase) ;    
      if(v1>=7)
      {
        v1 = v1-7; 
      }
      let  fecha = m().add(v1,'days');
      console.log('fecha0: ', fecha)
      fechasMentoria.push(fecha);
  
      for(let i = 0; i<3; i++){
         let  f = m(fecha).add(7,'days');
          fecha= f;
         fechasMentoria.push(f);
      };

      resultF.push({'mentores' : iterator, 'mentorias':iteratorMeto ,'fechasMentoria': fechasMentoria })
      }
    }

    await res.json({ body: resultF});
  } catch (error) {
    console.log('Este es el error', error)
    res.status(500);
    res.json(error.message);
  }
};

const getMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentoresMuestreo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    let sql = `SELECT xu.id,xm.id as mentor_id , concat(xu.nombre,' ', xu.apellidos) as nombres, 
              xm.curriculum, xm.dia, xm.hora1, xm.hora2,xm.duracion, xm.estado, xm.tipo , xm.online
              FROM ${_TABLA} xm, ${_TABLA5} xu 
              where xm.user_id = xu.id and xm.id = ?`;
    const mentores = await connection.query(sql, id);

    let resultF = [];
    for (const iterator of mentores) {
      const { mentor_id } = iterator;
      const { dia } = iterator;
      let sql1 = `SELECT xm.id as mentoria_id,xd.mentor_id ,xm.codigo, concat(xm.nombre,' ', xm.apellido) as nombreResp, xm.correo, 
      concat(codigoTel,' ',telefono) as telefonoResp, xm.fechaMentoria, xm.hora1 as hora1Mentoria, xm.hora2 as hora2Mentoria, xm.flg_mensaje, 
      xm.mensaje, xt.nombre as nombreArea, xe.nombre as nombreEspecialidad,xm.estado 
      FROM ${_TABLA8} xd, ${_TABLA1} xm , ${_TABLA7} xe, ${_TABLA2} xt  
      WHERE xd.mentor_id = xm.id and xd.especialidad_id = xe.id and xe.areas_id = xt.id and xd.mentor_id  = ?`;
      const mentoria = await connection.query(sql1, mentor_id);
     
      for (const iteratorMeto of mentoria) {
       let  fechasMentoria = [];
       const m =  require('moment')
       let diaHoy = m().isoWeekday();
       let v1;
       let  diaBase = dia; 
      console.log('diahoy: ', diaHoy, ' diaBase: ', diaBase)
        v1 = (7 - diaHoy + diaBase) ;    
      if(v1>=7)
      {
        v1 = v1-7; 
      }
      let  fecha = m().add(v1,'days');
      console.log('fecha0: ', fecha)
      fechasMentoria.push(fecha);
  
      for(let i = 0; i<3; i++){
         let  f = m(fecha).add(7,'days');
          fecha= f;
         fechasMentoria.push(f);
      };

      resultF.push({'mentores' : iterator, 'mentorias':iteratorMeto ,'fechasMentoria': fechasMentoria })
      }
    }

    await res.json({ body: resultF});
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateMentor = async (req, res) => {
    try {
        const { id } = req.params;
        const { curriculum ,user_id, tipo ,usuarioModificacion } = req.body;
        if (user_id === undefined) return res.status(400).json({ message: 'Bad Request' });
        const mentors = { curriculum, user_id,tipo,usuarioModificacion };
        mentors.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [mentors, id]);
        const foundmentors = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundmentors[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};


export const methods = {
  addMentores,
  getMentores,
  getMentoresMuestreos,
  getMentor,
  getMentoresMuestreo,
  updateMentor,
  deleteMentor,



};
