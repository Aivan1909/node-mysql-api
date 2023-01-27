import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';


const PUBLIC_URL  = process.env.PUBLIC_URL

const _TABLA = "tmunay_criterios"

const addCriterios = async (req, res) => {
  try {
    const criterio = req.body;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, criterio);
    const path = SaveOneFile({ mainFolder: 'criterio', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

const getCriterios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    const foundCriterioWithImages = [...result].map((item) => {
        return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundCriterioWithImages });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

const getCriterio = async (req, res) => {
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

const updateCriterio = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, imagen , imagenEN, usuarioModificacion } = req.body;
    if (descripcion === undefined) return res.status(400).json({ message: 'Bad Request' });
    const criterio = { descripcion, imagen, imagenEN,  usuarioModificacion };
    criterio.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [criterio, id]);
    const foundCriterio = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.file) {
        updateOneFile({ pathFile: foundCriterio[0].imagen, file: req.file });
    }
    res.json({ body: foundCriterio[0] });
    
    // Insertar la segunda imagen 
        
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

const deleteCriterio = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundCriterio = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundCriterio.length > 0) {
        deleteOneFile(foundCriterio[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
} catch (error) {
    res.status(500);
    res.json(error.message);
}
}

export const methods = {
  addCriterios,
  getCriterios,
  getCriterio,
  updateCriterio,
  deleteCriterio
}