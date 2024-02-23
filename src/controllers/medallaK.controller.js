import { getConnection } from '../database/database';
import { encryptar, desencryptar } from '../middleware/crypto.mld';
import { SaveOneFile, deleleFolder, getOneFile, updateOneFile } from '../middleware/upload';

const moment = require("moment")
const config = require('../config');

const addMedallaK = async (req, res) => {
  try {
    const medallak = req.body;
    medallak.fechaCreacion = moment().format(config.formats.dateTime);
    medallak.usuarioCreacion = desencryptar(medallak.usuarioCreacion)
    medallak.estado = 1;
    const connection = await getConnection();

    const result = await connection.query(`INSERT INTO tmunay_medallaskumpita SET ?`, medallak);
    if (req.file) {
      const path = await SaveOneFile({ mainFolder: 'MedallaK', idFolder: result.insertId, file: req.file, targetSize: 400 });

      await connection.query(`UPDATE tmunay_medallaskumpita SET imagen=? WHERE id=?`, [
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

const getMedallasK = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmk.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre 
      FROM tmunay_medallaskumpita tmk
      LEFT JOIN users usc ON tmk.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmk.usuarioModificacion=usm.id`);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    const resultWithImages = [...result].map((item) => {
      return { ...item, fileImagen: getOneFile(item.imagen) };
    });

    res.json({ body: resultWithImages });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const getMedallak = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmk.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_medallaskumpita tmk
      LEFT JOIN users usc ON tmk.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmk.usuarioModificacion=usm.id
      WHERE tmk.id=? `, id);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    if (result.length === 0) return res.status(404).json({ mensaje: "e404" });
    const imagen = getOneFile(result[0].imagen);

    res.json({ body: { ...result[0], fileImagen: imagen } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateMedallak = async (req, res) => {
  try {
    const { id } = req.params;

    const medallak = req.body;
    medallak.fechaModificacion = moment().format(config.formats.dateTime);
    medallak.usuarioModificacion = desencryptar(medallak.usuarioModificacion)

    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_medallaskumpita SET ? WHERE id=?`, [medallak, id]);
    const foundmedallak = await connection.query(`SELECT * FROM tmunay_medallaskumpita WHERE id=?`, id);

    if (req.file) {
      const responseUpdateImagen = await updateOneFile({ pathFile: foundmedallak[0].imagen, file: req.file, targetSize: 400 });
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_medallaskumpita SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
    }

    res.json({ body: foundmedallak[0] });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
};

const deleteMedallak = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_medallaskumpita WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addMedallaK,
  getMedallasK,
  getMedallak,
  updateMedallak,
  deleteMedallak,
};
