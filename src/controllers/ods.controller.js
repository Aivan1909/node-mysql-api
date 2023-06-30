import { getConnection } from '../database/database';
import { SaveOneFile, deleleFolder, getOneFile, updateOneFile } from '../middleware/upload';

const addOdss = async (req, res) => {
  try {
    const Ods = req.body;
    Ods.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    Ods.estado = 1;
    const connection = await getConnection();
    const objImages = {};
    const result = await connection.query(`INSERT INTO tmunay_ods SET ?`, Ods);
    if (req.files) {
      [...req.files].forEach((item) => {
        objImages[item.fieldname] = SaveOneFile({ mainFolder: 'ods', idFolder: result.insertId, file: item });
      });
    }
    await connection.query(`UPDATE tmunay_ods SET imagen=?, imagenEN=? WHERE id=?`, [
      objImages['imagen'] || null,
      objImages['imagenEN'] || null,
      result.insertId,
    ]);
    res.json({ body: result });
  } catch (error) {
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
    console.log(req.params);
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
    const { nombre, usuarioModificacion } = req.body;
    if (nombre === undefined) res.status(400).json({ message: 'Bad Request' });

    const Ods = { nombre, usuarioModificacion };
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_ods SET ? WHERE id=?`, [Ods, id]);
    const foundOds = await connection.query(`SELECT * FROM tmunay_ods WHERE id=?`, id);
    if (req.files) {
      const imagen = [...req.files].filter((item) => item.fieldname === 'imagen')[0];
      const imagenEn = [...req.files].filter((item) => item.fieldname === 'imagenEN')[0];
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundOds[0].imagen, file: imagen });
      const responseUpdateImagenEn =
        imagenEn && updateOneFile({ pathFile: foundOds[0].imagenEn, file: imagenEn });
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_ods SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);

      if (responseUpdateImagenEn)
        await connection.query(`UPDATE tmunay_ods SET imagenEN=? WHERE id=?`, [responseUpdateImagenEn, id]);
    }
    res.json({ body: foundOds[0] });
  } catch (error) {
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
