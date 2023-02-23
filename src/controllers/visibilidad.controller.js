import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_visibilidad';
const _TABLA1 = 'plataforma_visibilidad';
const _TABLA2 = 'publicidad_visibilidad';



const addvisibilidades = async (req, res) => {
  try {

    //Obtencion de claves foraneas o externas
    //Plataforma
    let bkPlataforma = req.body.plataforma;
    delete req.body.plataforma
    //Publicidad
    let bkPublicidad = req.body.publicidad;
    delete req.body.publicidad

    const visibilidad = req.body;
    visibilidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    visibilidad.estado = 1;
    const connection = await getConnection();
    let  result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, visibilidad);

    const { insertId } = await result;
    //insertando a la tabla Plataforma
    await bkPlataforma.forEach(element => {
      const idExternaPlataforma ={
        visibilidad_id : insertId,
        plataforma_id: element
      }
    //console.log("IDS->externos ->" , idExternaPlataforma)
    connection.query(`INSERT INTO ${_TABLA1} SET ?`, idExternaPlataforma);
    });
    
    //insertando a la tabla Publicidad
    await bkPublicidad.forEach(element => {
      const idExternaPublicidad ={
        visibilidad_id : insertId,
        publicidad_id: element
      }
    console.log("IDS->externos ->" , idExternaPublicidad)
    connection.query(`INSERT INTO ${_TABLA2} SET ?`, idExternaPublicidad);
    }); 

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
