import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const addAsesor = async (req, res) => {
  try {
    const asesor = req.body;
    asesor.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    asesor.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_asesor SET ?`, asesor);
    const path = SaveOneFile({ mainFolder: 'asesor', idFolder: result.insertId, file: req.file, targetSize: 400 });
    await connection.query(`UPDATE tmunay_asesor SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result, msg: "Registro actualizado correctamente" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAsesores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_asesor`);
    const foundAsesoresWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundAsesoresWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAsesor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_asesor WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateAsesor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, imagen, cargo, redSocial, usuarioModificacion } = req.body;
    if (nombres === undefined) return res.status(400).json({ message: 'Bad Request' });
    const asesor = { nombres, apellidos, cargo, redSocial, usuarioModificacion };
    asesor.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_asesor SET ? WHERE id=?`, [asesor, id]);
    const foundAsesor = await connection.query(`SELECT * FROM tmunay_asesor WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundAsesor[0].imagen, file: imagen, targetSize: 400 });
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_asesor SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      else {
        const path = SaveOneFile({ mainFolder: 'asesor', idFolder: foundAsesor[0].id, file: req.file, targetSize: 400 });
        await connection.query(`UPDATE tmunay_asesor SET imagen=? WHERE id=?`, [path, foundAsesor[0].id]);
      }
    }
    res.json({ body: foundAsesor[0], msg: "Registro actualizado correctamente" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteAsesor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundAsesor = await connection.query(`SELECT * FROM tmunay_asesor WHERE id=?`, id);
    if (foundAlianza.length > 0) {
      deleteOneFile(foundAsesor[0].imagen);
    }
    const result = await connection.query(`DELETE FROM tmunay_asesor WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addAsesor,
  getAsesores,
  getAsesor,
  updateAsesor,
  deleteAsesor,
};
