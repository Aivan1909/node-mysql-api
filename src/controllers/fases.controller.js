import { getConnection } from '../database/database';


const addFases = async (req, res) => {
  try {
    const fase = req.body;
    fase.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    fase.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_fases SET ?`, fase);
    //const path = await SaveOneFile({ mainFolder: 'fase', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_fases SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getFases = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_fases WHERE estado = '1'`);
   // const foundFasesWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getFase = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_fases WHERE id=? and estado = '1' `, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateFase = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion,usuarioModificacion } = req.body;
        if (descripcion === undefined) return res.status(400).json({ message: 'Bad Request' });
        const fases = { descripcion, usuarioModificacion };
        fases.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE tmunay_fases SET ? WHERE id=?`, [fases, id]);
        const foundFases = await connection.query(`SELECT * FROM tmunay_fases WHERE id=?`, id);
        res.json({ body: foundFases[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteFase = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_fases WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addFases,
  getFases,
  getFase,
  updateFase,
  deleteFase,
};
