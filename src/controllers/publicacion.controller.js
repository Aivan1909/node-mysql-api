import { getConnection } from '../database/database';


const addPublicaciones = async (req, res) => {
  try {
    const publicacion = req.body;
    publicacion.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    publicacion.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_publicacion SET ?`, publicacion);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPublicaciones = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmpu.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_publicacion tmpu
      LEFT JOIN users usc ON tmpu.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmpu.usuarioModificacion=usm.id`);

    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmpu.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_publicacion tmpu
      LEFT JOIN users usc ON tmpu.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmpu.usuarioModificacion=usm.id
      WHERE id=?`, id);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    res.json({ body: result[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    delete req.body.id
    delete req.body.usuarioCreacion
    delete req.body.fechaCreacion

    const { titulo } = req.body;
    if (titulo === undefined) return res.status(400).json({ message: 'Bad Request' });
    const publicacion = req.body;
    publicacion.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_publicacion SET ? WHERE id=?`, [publicacion, id]);
    const foundpublicaion = await connection.query(`SELECT * FROM tmunay_publicacion WHERE id=?`, id);
    res.json({ body: foundpublicaion[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deletePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_publicacion WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addPublicaciones,
  getPublicaciones,
  getPublicacion,
  updatePublicacion,
  deletePublicacion,
};
