import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_departamentos';
const adddptos = async (req, res) => {
  try {
    const dpto = req.body;
    //dpto.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, dpto);
    //const path = SaveOneFile({ mainFolder: 'dpto', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getdptos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);

    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const getdpto = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatedpto = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, descripcion  } = req.body;
        if (descripcion === undefined) return res.status(400).json({ message: 'Bad Request' });
        const dpto = { codigo,descripcion };
        //dpto.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [dpto, id]);
        const founddpto = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        //if (req.file) {
        //    updateOneFile({ pathFile: founddpto[0].imagen, file: req.file });
        //}
        res.json({ body: founddpto[0]});
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletedpto = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    //const founddpto = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    //if (founddpto.length > 0) {
    //  deleteOneFile(founddpto[0].imagen);
    //}
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  adddptos,
  getdptos,
  getdpto,
  updatedpto,
  deletedpto,
};
