import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_visibilidad';
const _TABLA1 = 'publicidad_visibilidad';
const _TABLA2 = 'plataforma_visibilidad';


const addvisibilidades = async (req, res) => {
  try {
    const visibilidad = req.body;
    visibilidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    visibilidad.estado = 1;
    const connection = await getConnection();
    let  result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, visibilidad);

    //insertando la relacional  de publicidad  
    const { insertId } = result;
    const relacionPublicidad = {
      publicidad_id: insertId,
      visibilidad_id: req.visibilidad,
    };

    result = await connection.query(
      `INSERT INTO ${_TABLA1} SET ?`,
      relacionPublicidad
    );
    //Insertando  a la tabla relacional 
    
    result = await connection.query(
      `SELECT * FROM ${_TABLA} WHERE id=?`,
      insertId
    );

    //insertando la relacional  de publicidad  
    const { insertId1 } = result;
    const relacionPlataforma = {
      plataforma_id: insertId,
      visibilidad_id: req.visibilidad,
    };

    result = await connection.query(
      `INSERT INTO ${_TABLA2} SET ?`,
      relacionPlataforma
    );
    //Insertando la relacional de plataforma
    
    result = await connection.query(
      `SELECT * FROM ${_TABLA} WHERE id=?`,
      insertId1
    );
    
    //Insertar la tabla relacional  con emprendimiento


    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getvisibilidades = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1'`);
   // const foundvisibilidadsWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getvisibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updatevisibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nroPublicacion } = req.body;
        if (nroPublicacion === undefined) return res.status(400).json({ message: 'Bad Request' });
        const visibilidads = { nroPublicacion, usuarioModificacion };
        visibilidads.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [visibilidads, id]);
        const foundvisibilidads = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundvisibilidads[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletevisibilidad = async (req, res) => {
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
  addvisibilidades,
  getvisibilidades,
  getvisibilidad,
  updatevisibilidad,
  deletevisibilidad,
};
