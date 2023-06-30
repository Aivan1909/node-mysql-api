import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_plataforma';

const addPlataformas = async (req, res) => {
  try {
    const plataforma = req.body;
    plataforma.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    plataforma.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, plataforma);
    
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPlataformas = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado  = '1'`);
    
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPlataforma = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatePlataforma = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const plataformas = { nombre, usuarioModificacion };
    plataformas.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [plataformas, id]);
    const foundplataformas = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: foundplataformas[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const deletePlataforma = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addPlataformas,
  getPlataformas,
  getPlataforma,
  updatePlataforma,
  deletePlataforma,
};
