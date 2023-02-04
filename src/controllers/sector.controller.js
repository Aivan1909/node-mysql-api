import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_sectores';
const addsectores = async (req, res) => {
  try {
    const sector = req.body;
    sector.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    sector.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, sector);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getsectores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado = '1'`);
    
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getsector = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and esatdo = '1'` , id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updatesector = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion  } = req.body;
        if (descripcion === undefined) return res.status(400).json({ message: 'Bad Request' });
        const sector = { descripcion };
        sector.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [sector, id]);
        const foundsector = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        //if (req.file) {
        //    updateOneFile({ pathFile: foundsector[0].imagen, file: req.file });
        //}
        res.json({ body: foundsector[0]});
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletesector = async (req, res) => {
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
  addsectores,
  getsectores,
  getsector,
  updatesector,
  deletesector,
};
