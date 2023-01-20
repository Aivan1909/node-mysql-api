import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';


const PUBLIC_URL  = process.env.PUBLIC_URL

const _TABLA = "tmunay_colaboradores"
const addColaboradores = async (req, res) => {
  try {
    const colaborador = req.body;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, colaborador);
    const path = SaveOneFile({ mainFolder: 'colaborador', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

const getColaboradores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    const foundColaboradorWithImages = [...result].map((item) => {
        return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundColaboradorWithImages });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

const getColaborador = async (req, res) => {
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
}

const updateColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, enlace, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const colaborador = { nombre, enlace, usuarioModificacion };
    colaborador.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [colaborador, id]);
    const foundColaborador = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.file) {
        updateOneFile({ pathFile: foundColaborador[0].imagen, file: req.file });
    }
    res.json({ body: foundColaborador[0] });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

const deleteColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundColaborador = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundColaborador.length > 0) {
        deleteOneFile(foundColaborador[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

export const methods = {
  addColaboradores,
  getColaboradores,
  getColaborador,
  updateColaborador,
  deleteColaborador
}