import { getConnection } from '../database/database';

const _TABLA = 'tmunay_instituciones';


const addInstituciones = async (req, res) => {
  try {
    let bkArea = req.body.area;
    delete req.body.area;
    const institucion = req.body;
    institucion.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    institucion.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, institucion);

    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
};

const getInstituciones = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = 1`);

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getInstitucion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = 1`, id);
    if (!result.length > 0) return res.status(404);

    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateInstitucion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const institucion = { nombre };
    institucion.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');

    const connection = await getConnection();
    result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [institucion, id]);

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteInstitucion = async (req, res) => {
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
  addInstituciones,
  getInstituciones,
  getInstitucion,
  updateInstitucion,
  deleteInstitucion,
};
