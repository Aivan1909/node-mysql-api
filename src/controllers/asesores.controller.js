import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_asesor';
const addAsesor = async (req, res) => {
  try {
    const asesor = req.body;
    asesor.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, asesor);
    const path = SaveOneFile({ mainFolder: 'asesor', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getAsesores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    const foundAsesoresWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundAsesoresWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getAsesor = async (req, res) => {
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

const updateAsesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres,apellidos,cargo,redSocial, usuarioModificacion } = req.body;
        if (nombres === undefined) return res.status(400).json({ message: 'Bad Request' });
        const asesor = { nombre, apellidos, cargo, redSocial, usuarioModificacion };
        asesor.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [asesor, id]);
        const foundAlianza = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        if (req.file) {
            updateOneFile({ pathFile: foundAsesor[0].imagen, file: req.file });
        }
        res.json({ body: foundAsesor[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteAsesor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundAsesor = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundAlianza.length > 0) {
      deleteOneFile(foundAsesor[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

export const methods = {
  addAsesor,
  getAsesores,
  getAsesor,
  updateAsesor,
  deleteAsesor,
};
