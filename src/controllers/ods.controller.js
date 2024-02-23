import { getConnection } from '../database/database';
import { SaveOneFile, deleleFolder, getOneFile, updateOneFile } from '../middleware/upload';

const moment = require("moment")
const config = require('../config');
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const addOdss = async (req, res) => {
  try {
    const ods = req.body;
    ods.usuarioCreacion = desencryptar(ods.usuarioCreacion);
    ods.fechaCreacion = moment().format(config.formats.dateTime);
    ods.estado = 1;
    const connection = await getConnection();
    const objImages = {};
    const result = await connection.query(`INSERT INTO tmunay_ods SET ?`, ods);
    if (req.files) {
      for (const item of [...req.files]) {
        objImages[item.fieldname] = await SaveOneFile({ mainFolder: 'ods', idFolder: result.insertId, file: item, targetSize: 400 });
      }

      await connection.query(`UPDATE tmunay_ods SET imagen=?, imagenEN=? WHERE id=?`, [
        objImages['imagen'] || null,
        objImages['imagenEN'] || null,
        result.insertId,
      ]);
      res.json({ body: result });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const getOdssWithoutImages = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_ods`);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getOdss = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
    SELECT tmod.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre 
    FROM tmunay_ods tmod
    LEFT JOIN users usc ON tmod.usuarioCreacion=usc.id
    LEFT JOIN users usm ON tmod.usuarioModificacion=usm.id`);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    const foundOdsWithImages = [...result].map((item) => {
      return { ...item, fileImagen: getOneFile(item.imagen), fileImagenEN: getOneFile(item.imagenEN) };
    });
    res.json({ body: foundOdsWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getOds = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`
    SELECT tmod.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre 
    FROM tmunay_ods tmod
    LEFT JOIN users usc ON tmod.usuarioCreacion=usc.id
    LEFT JOIN users usm ON tmod.usuarioModificacion=usm.id
    WHERE tmod.id=?`, id);
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

const updateOds = async (req, res) => {
  try {
    const { id } = req.params;
    const ods = req.body;
    if (ods.nombre === undefined) res.status(400).json({ message: 'Bad Request' });

    ods.usuarioModificacion = desencryptar(ods.usuarioModificacion);
    ods.fechaModificacion = moment().format(config.formats.dateTime);

    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_ods SET ? WHERE id=?`, [ods, id]);
    const foundOds = await connection.query(`SELECT * FROM tmunay_ods WHERE id=?`, id);

    if (req.files) {
      const imagen = await [...req.files].filter((item) => item.fieldname === 'imagen')[0];
      if (imagen) {
        const responseUpdateImagen = await updateOneFile({ pathFile: foundOds[0].imagen, file: imagen, targetSize: 400 });
        if (responseUpdateImagen)
          await connection.query(`UPDATE tmunay_ods SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      }
      const imagenEn = await [...req.files].filter((item) => item.fieldname === 'imagenEN')[0];
      if (imagenEn) {
        const responseUpdateImagenEn = await updateOneFile({ pathFile: foundOds[0].imagenEN, file: imagenEn, targetSize: 400 });
        console.log("Img", responseUpdateImagenEn)

        if (responseUpdateImagenEn)
          await connection.query(`UPDATE tmunay_ods SET imagenEN=? WHERE id=?`, [responseUpdateImagenEn, id]);
      }
    }
    res.json({ body: foundOds[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const deleteOds = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const connection = await getConnection();
    const foundOds = await connection.query(`SELECT * FROM tmunay_ods WHERE id=?`, id);
    if (foundOds.length > 0) {
      deleleFolder(foundOds[0].imagen || foundOds[0].imagenEN);
    }
    const result = await connection.query(`DELETE FROM tmunay_ods WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

export const methods = {
  addOdss,
  getOdss,
  getOds,
  updateOds,
  deleteOds,
  getOdssWithoutImages
};
