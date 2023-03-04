import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_publicacion';

const addPublicaciones = async (req, res) => {
  try {
    const publicacion = req.body;
    publicacion.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    publicacion.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`,publicacion);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getPublicaciones = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1'`);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = '1'`, id);
    res.json({ body:  result[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updatePublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, enlaceES, enlaceEN, usuarioModificacion } = req.body;
        if (titulo === undefined) return res.status(400).json({ message: 'Bad Request' });
        const publicacion = { titulo, enlaceES, enlaceEN, usuarioModificacion };
        publicacion.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [publicacion, id]);
        const foundpublicaion = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body:foundpublicaion[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletePublicacion = async (req, res) => {
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
  addPublicaciones,
  getPublicaciones,
  getPublicacion,
  updatePublicacion,
  deletePublicacion,
};
