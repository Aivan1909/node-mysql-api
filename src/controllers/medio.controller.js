import { getConnection } from '../database/database';

const addmedios = async (req, res) => {
  try {
    const medio = req.body;
    medio.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    medio.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_medios SET ?`, medio);
    //const path = SaveOneFile({ mainFolder: 'medio', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_medios SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getmedios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT id as 'value', redSocial as 'label' FROM tmunay_medios`);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getmedio = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_medios WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatemedio = async (req, res) => {
    try {
        const { id } = req.params;
        const {redSocial, descripcion } = req.body;
        if (redSocial === undefined) return res.status(400).json({ message: 'Bad Request' });
        const medio = { redSocial, descripcion };
        medio.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE tmunay_medios SET ? WHERE id=?`, [medio, id]);
        const foundmedio = await connection.query(`SELECT * FROM tmunay_medios WHERE id=?`, id);

        res.json({ body: foundmedio[0]});
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletemedio = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    const result = await connection.query(`DELETE FROM tmunay_medios WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addmedios,
  getmedios,
  getmedio,
  updatemedio,
  deletemedio,
};
