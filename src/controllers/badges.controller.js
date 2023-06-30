import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const _TABLA = 'tmunay_badges';
const addBadges = async (req, res) => {
  try {
    const badges = req.body;
    badges.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    badges.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, badges);
    const path = SaveOneFile({ mainFolder: 'badges', idFolder: result.insertId, file: req.file, targetSize: 500 });
    await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getBadges = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} where estado  = '1'`);
    const foundBadgesWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundBadgesWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { nivel, tipo, usuarioModificacion } = req.body;
    if (nivel === undefined) return res.status(400).json({ message: 'Bad Request' });
    const badge = { nivel, tipo, usuarioModificacion };
    badge.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [badge, id]);
    const foundBadge = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.file) {
      updateOneFile({ pathFile: foundBadge[0].imagen, file: req.file, targetSize: 500 });
    }
    res.json({ body: foundBadge[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundBadge = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundBadge.length > 0) {
      deleteOneFile(foundBadge[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addBadges,
  getBadges,
  getBadge,
  updateBadge,
  deleteBadge,
};
