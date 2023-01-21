import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_figuras';
const addfiguras = async (req, res) => {
  try {
    const figura = req.body;
    figura.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    figura.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, figura);
    //const path = SaveOneFile({ mainFolder: 'figura', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getfiguras = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getfigura = async (req, res) => {
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

const updatefigura = async (req, res) => {
    try {
        const { id } = req.params;
        const {descripcion } = req.body;
        if (descripcion === undefined) return res.status(400).json({ message: 'Bad Request' });
        const figura = { descripcion };
        figura.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [figura, id]);
        const foundfigura = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        //if (req.file) {
        //    updateOneFile({ pathFile: foundfigura[0].imagen, file: req.file });
        //}
        res.json({ body: foundfigura[0]});
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletefigura = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    //const foundfigura = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    //if (foundfigura.length > 0) {
    //  deleteOneFile(foundfigura[0].imagen);
    //}
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

export const methods = {
  addfiguras,
  getfiguras,
  getfigura,
  updatefigura,
  deletefigura,
};
