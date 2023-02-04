import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_publicidad';

const addPublicidades = async (req, res) => {
  try {
    const publicidad = req.body;
    publicidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    publicidad.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, publicidad);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getPublicidades = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1'`);

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getPublicidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updatePublicidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
        const publicidads = { nombre, usuarioModificacion };
        publicidads.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [publicidads, id]);
        const foundpublicidads = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundpublicidads[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletePublicidad = async (req, res) => {
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
  addPublicidades,
  getPublicidades,
  getPublicidad,
  updatePublicidad,
  deletePublicidad,
};
