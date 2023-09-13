import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const _TABLA = 'tmunay_trayectoria';
const addTrayectoria = async (req, res) => {
  try {
    const trayectoria = req.body;
    trayectoria.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    trayectoria.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, trayectoria);
    const path = await SaveOneFile({ mainFolder: 'trayectoria', idFolder: result.insertId, file: req.file, targetSize: 500 });
    await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getTrayectorias = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1' `);
    const foundTrayectoriasWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundTrayectoriasWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getTrayectoria = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = '1' `, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    const image = getOneFile(result[0].imagen);

    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateTrayectoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, imagen, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const trayectoria = { nombre, imagen, usuarioModificacion };
    trayectoria.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [trayectoria, id]);
    const foundTrayectoria = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundTrayectoria[0].imagen, file: imagen, targetSize: 500 });
      if (responseUpdateImagen)
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      else {
        const path = await SaveOneFile({ mainFolder: 'trayectoria', idFolder: foundTrayectoria[0].id, file: req.file, targetSize: 500 });
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, foundTrayectoria[0].id]);
      }
    }

    res.json({ body: foundTrayectoria[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteTrayectoria = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundTrayectoria = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundTrayectoria.length > 0) {
      deleteOneFile(foundTrayectoria[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addTrayectoria,
  getTrayectorias,
  getTrayectoria,
  updateTrayectoria,
  deleteTrayectoria,
};
