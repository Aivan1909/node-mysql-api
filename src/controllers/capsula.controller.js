import { getConnection } from '../database/database';
import { encryptar, desencryptar } from '../middleware/crypto.mld';


const addCapsulas = async (req, res) => {
  try {
    const capsula = req.body;
    capsula.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    capsula.estado = 1;
    capsula.usuarioCreacion = desencryptar(capsula.usuarioCreacion)

    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_capsulas SET ?`, capsula);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCapsulas = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT tmca.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacion
      , CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacion, tmes.nombre AS especialidad_nombre
      FROM tmunay_capsulas tmca
      LEFT JOIN users usc ON tmca.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmca.usuarioModificacion=usm.id
      LEFT JOIN tmunay_especialidad tmes ON tmca.especialidad_id=tmes.id`);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCapsula = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    const result = await connection.query(`SELECT tmca.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacion
      , CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacion, tmes.nombre AS especialidad_nombre
      FROM tmunay_capsulas tmca
      LEFT JOIN users usc ON tmca.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmca.usuarioModificacion=usm.id 
      LEFT JOIN tmunay_especialidad tmes ON tmca.especialidad_id=tmes.id
      WHERE tmca.id=?`, id);

    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });

    res.json({ body: result[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateCapsula = async (req, res) => {
  try {
    const { id } = req.params;
    const capsula = req.body;
    if (capsula.titulo === undefined) return res.status(400).json({ message: 'Bad Request' });

    capsula.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');

    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_capsulas SET ? WHERE id=?`, [capsula, id]);

    const foundcapsula = await connection.query(`SELECT * FROM tmunay_capsulas WHERE id=?`, id);
    res.json({ body: foundcapsula[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteCapsula = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_capsulas WHERE id=?`, id);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addCapsulas,
  getCapsulas,
  getCapsula,
  updateCapsula,
  deleteCapsula,
};
