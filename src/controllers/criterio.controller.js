import { getConnection } from '../database/database';
import { SaveOneFile, deleleFolder, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL  = process.env.PUBLIC_URL

const _TABLA = "tmunay_criterios"

const addCriterios = async (req, res) => {
  try {
    const criterio = req.body;
    criterio.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    criterio.estado = 1;
    const connection = await getConnection();
    const objImages = {};
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, criterio);
    if (req.files) {
      [...req.files].forEach((item) => {
        objImages[item.fieldname] = SaveOneFile({ mainFolder: 'criterio', idFolder: result.insertId, file: item });
      });
    }
    await connection.query(`UPDATE ${_TABLA} SET imagen=?, imagenEN=? WHERE id=?`, [
      objImages['imagen'] || null,
      objImages['imagenEN'] || null,
      result.insertId,
    ]);
    res.json({ body: result });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

const getCriteriosWithoutImages = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getCriterios = async (req, res) => {
try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    const foundCriterioWithImages = [...result].map((item) => {
      return { ...item, fileImagen: getOneFile(item.imagen), fileImagenEN: getOneFile(item.imagenEN) };
    });
    res.json({ body: foundCriterioWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const getCriterio = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (result.length === 0) return res.status(404).json({ message: 'No existe ningun resultado' });
    const imagen = getOneFile(result[0].imagen);
    const imagenEn = getOneFile(result[0].imagenEN);
    res.json({ body: { ...result[0], fileImagen: imagen, fileImagenEN: imagenEn } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const updateCriterio = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, usuarioModificacion } = req.body;
    if (descripcion === undefined) res.status(400).json({ message: 'Bad Request' });

    const criterio = { descripcion, usuarioModificacion };
    const connection = await getConnection();
    const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [criterio, id]);
    const foundCriterio = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.files) {
      const imagen = [...req.files].filter((item) => item.fieldname === 'imagen')[0];
      const imagenEn = [...req.files].filter((item) => item.fieldname === 'imagenEN')[0];
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundCriterio[0].imagen, file: imagen });
      const responseUpdateImagenEn =
        imagenEn && updateOneFile({ pathFile: foundCriterio[0].imagenEn, file: imagenEn });
      if (responseUpdateImagen)
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      console.log(responseUpdateImagen)
      if (responseUpdateImagenEn)
        await connection.query(`UPDATE ${_TABLA} SET imagenEN=? WHERE id=?`, [responseUpdateImagenEn, id]);
      console.log(responseUpdateImagenEN)

    }
    res.json({ body: foundCriterio[0] }); 
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

const deleteCriterio = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const connection = await getConnection();
    const foundCriterio = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundCriterio.length > 0) {
      deleleFolder(foundCriterio[0].imagen || foundCriterio[0].imagenEN);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
}

export const methods = {
  addCriterios,
  getCriteriosWithoutImages,
  getCriterios,
  getCriterio,
  updateCriterio,
  deleteCriterio
}