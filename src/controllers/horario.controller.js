import { getConnection } from '../database/database';


const addHorarios = async (req, res) => {
  try {
    const horario = req.body;
    horario.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    horario.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_dias SET ?`, horario);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getHorarios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_dias where estado = '1'`);
    // const foundhorariosWithImages = [...result].map((item) => {
    // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_dias WHERE id=? and estado ='1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora1, usuarioModificacion } = req.body;

    const horarios = { fecha, hora1, usuarioModificacion };
    horarios.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_dias SET ? WHERE id=?`, [horarios, id]);
    const foundhorarios = await connection.query(`SELECT * FROM tmunay_dias WHERE id=?`, id);
    res.json({ body: foundhorarios[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_dias WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addHorarios,
  getHorarios,
  getHorario,
  updateHorario,
  deleteHorario,
};
