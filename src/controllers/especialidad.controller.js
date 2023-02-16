import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_especialidad';
const _TABLA1 = 'tmunay_areas';


const addEspecialidades = async (req, res) => {
  try {
    const especialidad = req.body;
    especialidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    especialidad.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, especialidad);
    //const path = SaveOneFile({ mainFolder: 'especialidad', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getEspecialidades = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT A.*, B.id, B.nombre as nombreArea
    FROM ${_TABLA} A,  ${_TABLA1} B
    WHERE A.areas_id = B.id and A.estado  = '1'`);
   // const foundespecialidadsWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion  } = req.body;
        if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
        const especialidads = { nombre, descripcion };
        especialidads.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [especialidads, id]);
        const foundespecialidads = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundespecialidads[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

export const methods = {
  addEspecialidades,
  getEspecialidades,
  getEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
};
