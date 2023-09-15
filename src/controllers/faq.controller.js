import { getConnection } from '../database/database';

const addRegistro = async (req, res) => {
  try {
    const faq = req.body;
    faq.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    faq.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_faq SET ?`, faq);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getRegistros = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmfa.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_faq tmfa
      LEFT JOIN users usc ON tmfa.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmfa.usuarioModificacion=usm.id
      ORDER BY tmfa.orden`);
    result = [...result].map(item => {
      return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre }
    })

    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const getRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`
    SELECT tmfa.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
    FROM tmunay_faq tmfa
    LEFT JOIN users usc ON tmfa.usuarioCreacion=usc.id
    LEFT JOIN users usm ON tmfa.usuarioModificacion=usm.id
    WHERE tmfa.id=?`, id);
    result = [...result].map(item => {
      return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre }
    })
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = req.body;

    faq.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_faq SET ? WHERE id=?`, [faq, id]);

    const foundfaq = await connection.query(`SELECT * FROM tmunay_faq WHERE id=?`, id);

    res.json({ body: foundfaq[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};



const deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_faq WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addRegistro,
  getRegistros,
  getRegistro,
  updateRegistro,
  deleteRegistro,
};
