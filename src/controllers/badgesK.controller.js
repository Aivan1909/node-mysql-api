import { getConnection } from '../database/database';


const addBadges = async (req, res) => {
  try {
    const badge = req.body;
    badge.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    badge.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_badges SET ?`, badge);
    //const path = await SaveOneFile({ mainFolder: 'badgeia', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_badges SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getBadges = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_badges where estado = '1'`);
   // const foundbadgeiasWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_badges WHERE id=? and estado  = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateBadge = async (req, res) => {
    try {
        const { id } = req.params;
        const { nivel, tipo, imagen } = req.body;
        if (nivel === undefined) return res.status(400).json({ message: 'Bad Request' });
        const badge = { nivel, tipo, imagen  };
        badge.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE tmunay_badges SET ? WHERE id=?`, [badge, id]);
        const foundbadge = await connection.query(`SELECT * FROM tmunay_badges WHERE id=?`, id);
        res.json({ body: foundbadge[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_badges WHERE id=?`, id);
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
