import { getConnection } from '../database/database';

const addplanes = async (req, res) => {
  try {
    const plan = req.body;
    plan.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    plan.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_planes SET ?`, plan);
    //const path = SaveOneFile({ mainFolder: 'plan', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_planes SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getplanes = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_planes where estado = '1'`);
    // const foundplansWithImages = [...result].map((item) => {
    // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getplan = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_planes WHERE id=? and estado  = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateplan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, monto, descuento, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const plans = { nombre, monto, descuento, usuarioModificacion };
    plans.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_planes SET ? WHERE id=?`, [plans, id]);
    const foundplans = await connection.query(`SELECT * FROM tmunay_planes WHERE id=?`, id);
    res.json({ body: foundplans[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteplan = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_planes WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addplanes,
  getplanes,
  getplan,
  updateplan,
  deleteplan,
};
