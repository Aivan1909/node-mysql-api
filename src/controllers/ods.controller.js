import { getConnection } from '../database/database';
import { SaveOneFile, deleleFolder, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_ods';
const addOdss = async (req, res) => {
    try {
        const Ods = req.body;
        const connection = await getConnection();
        const objImages = {};
        const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, Ods);
        if (req.files) {
            [...req.files].forEach((item) => {
                objImages[item.fieldname] = SaveOneFile({ mainFolder: 'ods', idFolder: result.insertId, file: item });
            });
        }
        await connection.query(`UPDATE ${_TABLA} SET imagen=?, imagenEN=? WHERE id=?`, [
            objImages['imagen'] || null,
            objImages['imagenEn'] || null,
            result.insertId,
        ]);
        res.json({ body: result });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const getOdssWithoutImages = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM ${_TABLA}`);
        res.json({ body: result });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};
const getOdss = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM ${_TABLA}`);
        const foundOdsWithImages = [...result].map((item) => {
            return { ...item, fileImagen: getOneFile(item.imagen),fileImagenEN:getOneFile(item.imagenEN) };
        });
        res.json({ body: foundOdsWithImages });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const getOds = async (req, res) => {
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
};

const updateOds = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, usuarioModificacion } = req.body;
        if (nombre === undefined) res.status(400).json({ message: 'Bad Request' });

        const Ods = { nombre, usuarioModificacion };
        const connection = await getConnection();
        const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [Ods, id]);
        const foundOds = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        if (req.files) {
            const imagen = [...req.files].filter((item) => item.fieldname === 'imagen')[0];
            const imagenEn = [...req.files].filter((item) => item.fieldname === 'imagenEn')[0];
            const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundOds[0].imagen, file: imagen });
            const responseUpdateImagenEn =
                imagenEn && updateOneFile({ pathFile: foundOds[0].imagenEn, file: imagenEn });
            if (responseUpdateImagen)
                await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);

            if (responseUpdateImagenEn)
                await connection.query(`UPDATE ${_TABLA} SET imagenEN=? WHERE id=?`, [responseUpdateImagenEn, id]);
        }
        res.json({ body: foundOds[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteOds = async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const connection = await getConnection();
        const foundOds = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        if (foundOds.length > 0) {
            deleleFolder(foundOds[0].imagen || foundOds[0].imagenEN);
        }
        const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: result });
    } catch (error) {
        res.status(500);
        res.json(error.message);
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
