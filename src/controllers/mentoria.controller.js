import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_mentorias';
const _TABLA1 = 'mentoria_mentor';
const _TABLA2 = 'horario_mentoria';
const _TABLA3 = 'area_mentoria';
const _TABLA4 = 'emprendimiento_mentoria';


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
    let tipo= mentoria.tipo;
    const connection = await getConnection();
    let result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, mentoria);
    
    const {insertId} =  await result;

    //Generando  el  codigo de tipo de Mentoria
    
    let cod = insertId.toString();
    let codigo;
    if(tipo=='D'){ 
       codigo = 'D-'.concat(cod.padStart(7,0)) 
    }
    if(tipo=='E'){ 
      codigo = 'E-'.concat(cod.padStart(7,0)) 
   }
   await connection.query(`UPDATE ${_TABLA}  SET tipo = ? WHERE id =?`,[codigo,insertId]);
   
    //Insertando  el id Relacional Mentores
    await bkMentor.forEach (element => {
      const  idExternaMentor  = {
        mentorias_id: insertId,
        mentores_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaMentor)
      connection.query(`INSERT INTO ${_TABLA1} SET ?`, idExternaMentor);
    }); 
    //Insertando  el id Relacional Horarios
    //Insertando  el id Relacional Areas
    await bkArea.forEach (element => {
      const  idExternaArea  = {
        mentoria_id: insertId,
        area_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaArea)
      connection.query(`INSERT INTO ${_TABLA3} SET ?`, idExternaArea);
    });

    //Insertando  el id Relacional Emprendimiento
    await bkEmprendimiento.forEach (element => {
      const  idExternaEmprendimiento  = {
        mentorias_id: insertId,
        emprendimiento_id: element
      } ;
      console.log("IDS->externos ->" , idExternaEmprendimiento)
      connection.query(`INSERT INTO ${_TABLA4} SET ?`, idExternaEmprendimiento);
    });
  
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentorias = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
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
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateMentoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, codigoTel, telefono, mensaje, usuarioModificacion } = req.body;
        if (user_id === undefined) return res.status(400).json({ message: 'Bad Request' });
        const mentoria = { nombre, apellido, correo, codigoTel, telefono, mensaje, usuarioModificacion };
        mentoria.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [mentoria, id]);
        const foundmentoria = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
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
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
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
    let tipo= mentoria.tipo;
    const connection = await getConnection();
    let result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, mentoria);
    
    const {insertId} =  await result;

    //Generando  el  codigo de tipo de Mentoria
    
    let cod = insertId.toString();
    let codigo;
    if(tipo=='D'){ 
       codigo = 'D-'.concat(cod.padStart(7,0)) 
    }
    if(tipo=='E'){ 
      codigo = 'E-'.concat(cod.padStart(7,0)) 
   }
   await connection.query(`UPDATE ${_TABLA}  SET tipo = ? WHERE id =?`,[codigo,insertId]);
   
    //Insertando  el id Relacional Mentores
    await bkMentor.forEach (element => {
      const  idExternaMentor  = {
        mentorias_id: insertId,
        mentores_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaMentor)
      connection.query(`INSERT INTO ${_TABLA1} SET ?`, idExternaMentor);
    }); 
    //Insertando  el id Relacional Horarios
    //Insertando  el id Relacional Areas
    await bkArea.forEach (element => {
      const  idExternaArea  = {
        mentoria_id: insertId,
        area_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaArea)
      connection.query(`INSERT INTO ${_TABLA3} SET ?`, idExternaArea);
    });

    //Insertando  el id Relacional Emprendimiento
    await bkEmprendimiento.forEach (element => {
      const  idExternaEmprendimiento  = {
        mentorias_id: insertId,
        emprendimiento_id: element
      } ;
      console.log("IDS->externos ->" , idExternaEmprendimiento)
      connection.query(`INSERT INTO ${_TABLA4} SET ?`, idExternaEmprendimiento);
    });
  
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
  updateMentoria,
  deleteMentoria,
};
