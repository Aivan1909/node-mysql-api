import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_horarios';

const addHorarios = async (req, res) => {
  try {
    const horario = req.body;
    horario.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    horario.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, horario);
    //const path = SaveOneFile({ mainFolder: 'horario', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getHorarios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1'`);
   // const foundhorariosWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado ='1'`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha ,hora1, usuarioModificacion } = req.body;
        if (user_id === undefined) return res.status(400).json({ message: 'Bad Request' });
        const horarios = {fecha ,hora1, usuarioModificacion  };
        horarios.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [horarios, id]);
        const foundhorarios = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundhorarios[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteHorario = async (req, res) => {
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
  addHorarios,
  getHorarios,
  getHorario,
  updateHorario,
  deleteHorario,
};
