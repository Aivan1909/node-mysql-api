import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const addAlianza = async (req, res) => {
  try {
    const alianza = req.body;
    alianza.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    alianza.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_alianzas SET ?`, alianza);
    const path = SaveOneFile({ mainFolder: 'alianza', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE tmunay_alianzas SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result, msg: "Registro guardado correctamente" });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getAlianzas = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_alianzas where estado = '1'`);
    const foundAlianzasWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundAlianzasWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getAlianza = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_alianzas WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404);
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateAlianza = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, enlace, imagen, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const alianza = { nombre, enlace, usuarioModificacion };
    alianza.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_alianzas SET ? WHERE id=?`, [alianza, id]);
    const foundAlianza = await connection.query(`SELECT * FROM tmunay_alianzas WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundAlianza[0].imagen, file: req.file });
      
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_alianzas SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      else {
        const path = SaveOneFile({ mainFolder: 'asesor', idFolder: foundAlianza[0].id, file: req.file });
        await connection.query(`UPDATE tmunay_alianzas SET imagen=? WHERE id=?`, [path, foundAlianza[0].id]);
      }
    }
    res.json({ body: foundAlianza[0], msg: "Registro actualizado correctamente" });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteAlianza = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundAlianza = await connection.query(`SELECT * FROM tmunay_alianzas WHERE id=?`, id);
    if (foundAlianza.length > 0) {
      deleteOneFile(foundAlianza[0].imagen);
    }
    const result = await connection.query(`DELETE FROM tmunay_alianzas WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

export const methods = {
  addAlianza,
  getAlianzas,
  getAlianza,
  updateAlianza,
  deleteAlianza,
};
