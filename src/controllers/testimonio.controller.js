import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const _TABLA = "tmunay_testimonios"

const addTestimonios = async (req, res) => {
  try {
    const testimonio = req.body;
    testimonio.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    testimonio.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, testimonio);
    const path = SaveOneFile({ mainFolder: 'testimonio', idFolder: result.insertId, file: req.file, targetSize: 400 });
    await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const getTestimonios = async (req, res) => {

  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1' `);
    const foundTestimonioWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundTestimonioWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const getTestimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const updateTestimonio = async (req, res) => {

  try {
    const { id } = req.params;
    const { nombre, apellidos, testimonio, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const testimonioEditado = { nombre, apellidos, testimonio, usuarioModificacion };
    testimonioEditado.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [testimonioEditado, id]);
    const foundTestimonio = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImage = updateOneFile({ pathFile: foundTestimonio[0].imagen, file: req.file, targetSize: 400 });
      if (responseUpdateImage)
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [responseUpdateImage, id]);
    }
    res.json({ body: foundTestimonio[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }

}

const deleteTestimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundTestimonio = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundTestimonio.length > 0) {
      deleteOneFile(foundTestimonio[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export const methods = {
  addTestimonios,
  getTestimonios,
  getTestimonio,
  updateTestimonio,
  deleteTestimonio
}