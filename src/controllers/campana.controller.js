import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';
import { encryptar, desencryptar } from '../middleware/crypto.mld';


const addRegistro = async (req, res) => {
  try {
    const campana = req.body;
    campana.usuarioCreacion = desencryptar(campana.usuarioCreacion);
    campana.emprendimiento_id = desencryptar(campana.emprendimiento_id);
    campana.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    campana.estado = 2; // Pendiente de aprobacion

    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_campanas SET ?`, campana);
    const objImages = {};

    if (req.files) {
      await [...req.files].forEach((item) => {
        objImages[item.fieldname] = SaveOneFile({ mainFolder: 'campanias', idFolder: result.insertId, file: item, targetSize: 400 })
          .then(resp => {
            connection.query(`UPDATE tmunay_campanas SET ${item.fieldname}=? WHERE id=?`, [
              resp || null, result.insertId,
            ]);
          });
      });

      res.json({ body: result });
      /* console.log(objImages, objImages['imagen1'])
      await connection.query(`UPDATE tmunay_campanas SET imagen1=?, imagen2=?, imagen3=? WHERE id=?`, [
        objImages['imagen1'] || null,
        objImages['imagen2'] || null,
        objImages['imagen3'] || null,
        result.insertId,
      ]); */
    } else
      res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const getRegistros = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_campanas where estdo = '1'`);
    const resultWithImages = [...result].map((item) => {
      return { ...item, fileImagen1: getOneFile(item.imagen1), fileImagen2: getOneFile(item.imagen2), fileImagen3: getOneFile(item.imagen3) };
    });

    res.json({ body: resultWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_campanas WHERE id=? and estado  = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    const resultWithImages = [...result].map((item) => {
      return { ...item, fileImagen1: getOneFile(item.imagen1), fileImagen2: getOneFile(item.imagen2), fileImagen3: getOneFile(item.imagen3) };
    });

    res.json({ body: { ...resultWithImages[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, objetivo, descripcion, tipoMoneda, montoRequerido, fechaInicio, duracion, fechaFin, linkVideo, enlace, imagen1, imagen2, imagen3, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const campana = { nombre, objetivo, descripcion, tipoMoneda, montoRequerido, fechaInicio, duracion, fechaFin, linkVideo, enlace, imagen1, imagen2, imagen3, usuarioModificacion };
    campana.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_campanas SET ? WHERE id=?`, [campana, id]);
    const foundcampana = await connection.query(`SELECT * FROM tmunay_campanas WHERE id=?`, id);

    if (req.files) {
      const imagen = [...req.files].filter((item) => item.fieldname === 'imagen1')[0];
      const responseUpdateImagen = imagen && await updateOneFile({ pathFile: foundOds[0].imagen, file: imagen, targetSize: 400 });
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_campanas SET imagen1=? WHERE id=?`, [responseUpdateImagen, id]);

      const imagen2 = [...req.files].filter((item) => item.fieldname === 'imagen2')[0];
      const responseUpdateImagen2 =
        imagen2 && await updateOneFile({ pathFile: foundOds[0].imagen2, file: imagen2, targetSize: 400 });
      if (responseUpdateImagen2)
        await connection.query(`UPDATE tmunay_campanas SET imagen2=? WHERE id=?`, [responseUpdateImagen2, id]);

      const imagen3 = [...req.files].filter((item) => item.fieldname === 'imagen3')[0];
      const responseUpdateImagen3 =
        imagen3 && await updateOneFile({ pathFile: foundOds[0].imagen3, file: imagen3, targetSize: 400 });
      if (responseUpdateImagen3)
        await connection.query(`UPDATE tmunay_campanas SET imagen3=? WHERE id=?`, [responseUpdateImagen3, id]);
    }

    res.json({ body: foundcampana[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_campanas WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addRegistro,
  getRegistros,
  getRegistro,
  updateRegistro,
  deleteRegistro,
};
