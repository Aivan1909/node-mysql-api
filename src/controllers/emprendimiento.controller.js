import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_emprendimientos';
const addEmprendimiento = async (req, res) => {
  try {
    const Emprendimiento = req.body;
    const objImages = {}
    Emprendimiento.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, Emprendimiento);

    if (req.files) {
      [...req.files].forEach((item) => {
          objImages[item.fieldname] = SaveOneFile({ mainFolder: 'emprendimientos', idFolder: result.insertId, file: item });
      });
  }
  await connection.query(`UPDATE ${_TABLA} SET logo=?, fotoFundadores=?, fotoEquipo=?, documento=?, portada=? WHERE id=?`, [
      objImages['logo'] || null,
      objImages['fotoFundadores'] || null,
      objImages['fotoEquipo'] || null,
      objImages['documento'] || null,
      objImages['portada'] || null,

      result.insertId,
  ]);

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getEmprendimientos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    const foundEmprendimientosWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundEmprendimientosWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateEmprendimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, enlace, usuarioModificacion } = req.body;
        if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
        const Emprendimiento = { nombre, enlace, usuarioModificacion };
        Emprendimiento.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [Emprendimiento, id]);
        const foundEmprendimiento = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        if (req.file) {
            const responseUpdateImage=updateOneFile({ pathFile: foundEmprendimiento[0].imagen, file: req.file });
            if(responseUpdateImage)
                await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [responseUpdateImage, id]);
        }
        res.json({ body: foundEmprendimiento[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundEmprendimiento = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundEmprendimiento.length > 0) {
      deleteOneFile(foundEmprendimiento[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

export const methods = {
  addEmprendimiento,
  getEmprendimientos,
  getEmprendimiento,
  updateEmprendimiento,
  deleteEmprendimiento,
};