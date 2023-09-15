import { getConnection } from '../database/database';

const addMedallaks = async (req, res) => {
  try {
    const medallak = req.body;
    medallak.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    medallak.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_medallaskumpita SET ?`, medallak);
    //const path = await SaveOneFile({ mainFolder: 'medallakia', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_medallaskumpita SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMedallaks = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_medallaskumpita where estado = '1'`);
   // const foundmedallakiasWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMedallak = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_medallaskumpita WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateMedallak = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoMedalla, imagen, cantidad } = req.body;
        if (tipoMedalla === undefined) return res.status(400).json({ message: 'Bad Request' });
        const medallak = { tipoMedalla, imagen, cantidad  };
        medallak.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE tmunay_medallaskumpita SET ? WHERE id=?`, [medallak, id]);
        const foundmedallak = await connection.query(`SELECT * FROM tmunay_medallaskumpita WHERE id=?`, id);
        res.json({ body: foundmedallak[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteMedallak = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_medallaskumpita WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addMedallaks,
  getMedallaks,
  getMedallak,
  updateMedallak,
  deleteMedallak,
};
