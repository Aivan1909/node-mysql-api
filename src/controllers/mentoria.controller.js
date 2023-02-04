import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_mentorias';
const _TABLA1 = 'horario_mentoria';
const _TABLA2 = 'area_mentoria';
const _TABLA3 = 'mentoria_mentor';


const addMentorias = async (req, res) => {
  try {
    const mentoria = req.body;
    mentoria.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    mentoria.estado = 1;
    const connection = await getConnection();
    let result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, mentoria);
    //const path = SaveOneFile({ mainFolder: 'mentoriaia', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    
    //insertando la relacion  Horarios 
    const {insertId} = result;
    const relacionHorarios  = { 
      mentorias_id: insertId,
      horarios_id: req.horarios_id 
    };

    result = await connection.query(
      `INSERT INTO ${_TABLA1} SET ?`,
      relacionHorarios
    );


    /*
    result = await connection.query(
      `SELECT * FROM ${_TABLA} WHERE id=?`,
      insertId
    );

    //Insertando la relacion de area 
    const {insertId1} = result ; 
    const relacionArea  = { 
      area_id: insertId1,
      mentoria_id: 1 //req.mentoria 
    };

    result = await connection.query(  
      `INSERT INTO ${_TABLA2} SET ?`,
      relacionArea
    );

    result = await connection.query(
      `SELECT * FROM ${_TABLA} WHERE id=?`,
      insertId1
    );
 
    //Insertando la relacion de Mentores 
    const {insertId2} = result ; 
    const relacionMentor  = { 
      mentores_id: 1, //insertId2,
      mentorias_id: 1 //req.mentoria 
    };

    result = await connection.query(
      `INSERT INTO ${_TABLA3} SET ?`,
      relacionMentor
    );

    result = await connection.query(
      `SELECT * FROM ${_TABLA} WHERE id=?`,
      insertId2
    );
*/
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
   // const foundmentoriaiasWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
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

export const methods = {
  addMentorias,
  getMentorias,
  getMentoria,
  updateMentoria,
  deleteMentoria,
};
