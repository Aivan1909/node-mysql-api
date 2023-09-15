import { getConnection } from '../database/database';

const addPlataformas = async (req, res) => {
  try {
    const plataforma = req.body;
    plataforma.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    plataforma.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_plataforma SET ?`, plataforma);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPlataformas = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_plataforma where estado  = '1'`);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPlataforma = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_plataforma WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatePlataforma = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const plataformas = { nombre, usuarioModificacion };
    plataformas.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_plataforma SET ? WHERE id=?`, [plataformas, id]);
    const foundplataformas = await connection.query(`SELECT * FROM tmunay_plataforma WHERE id=?`, id);
    res.json({ body: foundplataformas[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const deletePlataforma = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_plataforma WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addPlataformas,
  getPlataformas,
  getPlataforma,
  updatePlataforma,
  deletePlataforma,
};
