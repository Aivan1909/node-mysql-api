import { getConnection } from '../database/database';

const addPublicidades = async (req, res) => {
  try {
    const publicidad = req.body;
    publicidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    publicidad.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_publicidad SET ?`, publicidad);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPublicidades = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmpu.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_publicidad tmpu
      LEFT JOIN users usc ON tmpu.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmpu.usuarioModificacion=usm.id`);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPublicidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmpu.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_publicidad tmpu
      LEFT JOIN users usc ON tmpu.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmpu.usuarioModificacion=usm.id
      WHERE id=?` , id);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });

    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatePublicidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const publicidads = { nombre, usuarioModificacion };
    publicidads.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_publicidad SET ? WHERE id=?`, [publicidads, id]);
    const foundpublicidads = await connection.query(`SELECT * FROM tmunay_publicidad WHERE id=?`, id);
    res.json({ body: foundpublicidads[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deletePublicidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_publicidad WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addPublicidades,
  getPublicidades,
  getPublicidad,
  updatePublicidad,
  deletePublicidad,
};
