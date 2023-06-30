import { getConnection } from '../database/database';

const addsectores = async (req, res) => {
  try {
    const sector = req.body;
    sector.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    sector.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_sectores SET ?`, sector);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getsectores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_sectores where estado = 1 `);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getsector = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_sectores WHERE id=? and estado = 1`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatesector = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    if (descripcion === undefined) return res.status(400).json({ message: 'Bad Request' });
    const sector = { descripcion };
    sector.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_sectores SET ? WHERE id=?`, [sector, id]);
    const foundsector = await connection.query(`SELECT * FROM tmunay_sectores WHERE id=?`, id);

    res.json({ body: foundsector[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};



const deletesector = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_sectores WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addsectores,
  getsectores,
  getsector,
  updatesector,
  deletesector,
};
