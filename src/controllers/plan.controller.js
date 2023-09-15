import { getConnection } from '../database/database';

const addplanes = async (req, res) => {
  try {
    const plan = req.body;
    plan.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    plan.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_planes SET ?`, plan);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getplanes = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
    SELECT tmpl.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
    FROM tmunay_planes tmpl
    LEFT JOIN users usc ON tmpl.usuarioCreacion=usc.id
    LEFT JOIN users usm ON tmpl.usuarioModificacion=usm.id`);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getplan = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    let result = await connection.query(`
    SELECT tmpl.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
    FROM tmunay_planes tmpl
    LEFT JOIN users usc ON tmpl.usuarioCreacion=usc.id
    LEFT JOIN users usm ON tmpl.usuarioModificacion=usm.id
    WHERE tmpl.id=?`, id);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });

    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateplan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, monto, descuento, usuarioModificacion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const plans = { nombre, monto, descuento, usuarioModificacion };
    plans.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_planes SET ? WHERE id=?`, [plans, id]);
    const foundplans = await connection.query(`SELECT * FROM tmunay_planes WHERE id=?`, id);
    res.json({ body: foundplans[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteplan = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_planes WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

/* Funciones adicionales */

function crearNick(nombre) {
  // Replace Spanish characters with normal letters
  const replacedString = nombre
    .replace(/[áä]/g, 'a')
    .replace(/[éë]/g, 'e')
    .replace(/[íï]/g, 'i')
    .replace(/[óö]/g, 'o')
    .replace(/[úü]/g, 'u')
    .replace(/[ñ]/g, 'n');

  // Remove blank spaces
  const withoutSpaces = replacedString.replace(/\s/g, '_');

  // Convert to lowercase
  const lowercaseString = withoutSpaces.toLowerCase();

  // Delete special characters using regular expression
  const elLink = lowercaseString.replace(/[^a-z0-9]/g, '');

  return elLink
}
async function asignarNick(nombre, apellidos) {
  let newNick = await crearNick(nombre);

  const connection = await getConnection();
  let result = await connection.query(
    `select 1 from tmunay_planes where link=?`,
    newNick
  );

  if (result) {
    newNick = ""
  }

  return await newNick;
}

export const methods = {
  addplanes,
  getplanes,
  getplan,
  updateplan,
  deleteplan,
};
