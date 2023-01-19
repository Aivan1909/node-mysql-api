import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_alianzas';
const addAlianza = async (req, res) => {
    try {
        const alianza = req.body;
        const connection = await getConnection();
        const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, alianza);
        const path = SaveOneFile({ mainFolder: 'alianza', idFolder: result.insertId, file: req.file });
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
        res.json({ body: result });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const getAlianzas = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM ${_TABLA}`);
        const foundAlianzasWithImages = [...result].map((item) => {
            return { ...item, file: getOneFile(item.imagen) };
        });
        res.json({ body: foundAlianzasWithImages });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const getAlianza = async (req, res) => {
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

const updateAlianza = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, enlace, usuarioModificacion } = req.body;
        if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
        const alianza = { nombre, enlace, usuarioModificacion };
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [alianza, id]);
        const foundAlianza = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        if (req.file) {
            updateOneFile({ pathFile: foundAlianza[0].imagen, file: req.file });
        }
        res.json({ body: foundAlianza[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteAlianza = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const foundAlianza = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        if (foundAlianza.length > 0) {
            deleteOneFile(foundAlianza[0].imagen);
        }
        const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: result });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

export const methods = {
    addAlianza,
    getAlianzas,
    getAlianza,
    updateAlianza,
    deleteAlianza,
};
