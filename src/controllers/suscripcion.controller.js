import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = '	tmunay_suscripcion';

const addsuscripciones = async (req, res) => {
  try {
    const suscripcion = req.body;
    suscripcion.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    suscripcion.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, suscripcion);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getsuscripciones = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
   // const foundsuscripcionsWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getsuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updatesuscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        const { nit, razonSocial ,usuarioModificacion } = req.body;
        if (nit === undefined) return res.status(400).json({ message: 'Bad Request' });
        const suscripcions = { nit, razonSocial, usuarioModificacion };
        suscripcions.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [suscripcions, id]);
        const foundsuscripcions = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundsuscripcions[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deletesuscripcion = async (req, res) => {
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
  addsuscripciones,
  getsuscripciones,
  getsuscripcion,
  updatesuscripcion,
  deletesuscripcion,
};