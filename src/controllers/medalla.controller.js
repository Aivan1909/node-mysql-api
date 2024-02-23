import { getConnection } from '../database/database';
import { encryptar, desencryptar } from '../middleware/crypto.mld';
import { SaveOneFile, deleleFolder, getOneFile, updateOneFile } from '../middleware/upload';

const moment = require("moment")
const config = require('../config');

const addRegistro = async (req, res) => {
  try {
    const Medalla = req.body;
    Medalla.fechaCreacion = moment().format(config.formats.dateTime);
    Medalla.usuarioCreacion = desencryptar(Medalla.usuarioCreacion)
    Medalla.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_medallasnanay SET ?`, Medalla);

    if (req.file) {
      const path = await SaveOneFile({ mainFolder: 'MedallaN', idFolder: result.insertId, file: req.file, targetSize: 400 });

      await connection.query(`UPDATE tmunay_medallasnanay SET imagen=? WHERE id=?`, [
        path || null,
        result.insertId,
      ]);
    }

    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const getRegistrosNanay = async (req, res) => {
  try {

    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmmn.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_medallasnanay tmmn
      LEFT JOIN users usc ON tmmn.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmmn.usuarioModificacion=usm.id
    `)
    result = [...result].map(item => {
      return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre }
    })

    const foundMedallaWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundMedallaWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmmn.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre 
      FROM tmunay_medallasnanay tmmn
      LEFT JOIN users usc ON tmmn.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmmn.usuarioModificacion=usm.id
      WHERE tmmn.id=?`, id);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    if (result.length === 0) return res.status(404).json({ mensaje: "e404" });
    const imagen = getOneFile(result[0].imagen);
    const imagenEn = getOneFile(result[0].imagenEN);
    res.json({ body: { ...result[0], fileImagen: imagen, fileImagenEN: imagenEn } });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    const Medalla = req.body;
    Medalla.fechaModificacion = moment().format(config.formats.dateTime);
    Medalla.usuarioModificacion = desencryptar(Medalla.usuarioModificacion)

    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_medallasnanay SET ? WHERE id=?`, [Medalla, id]);
    const foundItem = await connection.query(`SELECT * FROM tmunay_medallasnanay WHERE id=?`, id);

    if (req.file) {
      const responseUpdateImagen = await updateOneFile({ pathFile: foundItem[0].imagen, file: req.file, targetSize: 400 });

      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_medallasnanay SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
    }
    res.json({ body: foundItem[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundItem = await connection.query(`SELECT * FROM tmunay_medallasnanay WHERE id=?`, id);
    if (foundItem.length > 0) {
      deleleFolder(foundItem[0].imagen);
    }

    const result = await connection.query(`DELETE FROM tmunay_medallasnanay WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

export const methods = {
  addRegistro,
  getRegistrosNanay,
  getRegistro,
  updateRegistro,
  deleteRegistro,
};
