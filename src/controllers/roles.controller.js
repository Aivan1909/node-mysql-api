import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_rol';

const addRoles = async (req, res) => {
  try {
    const rol = req.body;
    rol.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    rol.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, rol);
    //const path = SaveOneFile({ mainFolder: 'rol', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getRoles = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1'`);
   // const foundrolsWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getRol = async (req, res) => {
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

const updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion,usuarioModificacion } = req.body;
        if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
        const rols = { nombre ,descripcion, usuarioModificacion };
        rols.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [rols, id]);
        const foundrols = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundrols[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteRol = async (req, res) => {
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
  addRoles,
  getRoles,
  getRol,
  updateRol,
  deleteRol,
};
