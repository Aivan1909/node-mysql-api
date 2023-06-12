import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const addColaboradores = async (req, res) => {
  try {
    const colaborador = req.body;
    colaborador.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    colaborador.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_colaboradores SET ?`, colaborador);
    const path = SaveOneFile({ mainFolder: 'colaborador', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE tmunay_colaboradores SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result, msg: "Registro guardado correctamente" });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const getColaboradores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_colaboradores where estado = '1'`);
    const foundColaboradorWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundColaboradorWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const getColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_colaboradores WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404);
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const updateColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, enlace, imagen, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const colaborador = { nombre, enlace, usuarioModificacion };
    colaborador.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_colaboradores SET ? WHERE id=?`, [colaborador, id]);
    const foundColaborador = await connection.query(`SELECT * FROM tmunay_colaboradores WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundColaborador[0].imagen, file: imagen });
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_colaboradores SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      else {
        const path = SaveOneFile({ mainFolder: 'asesor', idFolder: foundColaborador[0].id, file: req.file });
        await connection.query(`UPDATE tmunay_colaboradores SET imagen=? WHERE id=?`, [path, foundColaborador[0].id]);
      }
    }
    res.json({ body: foundColaborador[0], msg: "Registro actualizado correctamente" });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const deleteColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundColaborador = await connection.query(`SELECT * FROM tmunay_colaboradores WHERE id=?`, id);
    if (foundColaborador.length > 0) {
      deleteOneFile(foundColaborador[0].imagen);
    }
    const result = await connection.query(`DELETE FROM tmunay_colaboradores WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

export const methods = {
  addColaboradores,
  getColaboradores,
  getColaborador,
  updateColaborador,
  deleteColaborador
}