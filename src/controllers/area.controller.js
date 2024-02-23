import { getConnection } from '../database/database';

const moment = require("moment")
const config = require('../config');
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const addAreas = async (req, res) => {
  try {

    const area = req.body;
    area.usuarioCreacion = desencryptar(area.usuarioCreacion);
    area.fechaCreacion = moment().format(config.formats.dateTime);
    area.estado = 1;
    area.link = await crearLink(area.nombre);

    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_areas SET ?`, area);

    res.json({ body: result });
  } catch (error) {
    const { code } = error;

    if (code == "ER_DUP_ENTRY")
      res.status(409).json({ message: `e422` });
    else res.status(500).json({ message: "Ocurrió un error inesperado." });
  }
};

const getAreas = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmar.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_areas tmar
      LEFT JOIN users usc ON tmar.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmar.usuarioModificacion=usm.id`);
    result = [...result].map(item => {
      var tipoDesc = ""
      switch (item.tipo) {
        case "E":
          tipoDesc = "Especialidad"
          break;
        case "D":
          tipoDesc = "Diagnostico"
          break;
        case "N":
          tipoDesc = "Nanocredito"
          break;

        default:
          tipoDesc = ""
          break;
      }
      return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre, tipoDesc }
    })

    for (const area of result) {
      let reEspecialidades = await connection.query(`
        SELECT tmes.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
        FROM tmunay_especialidad tmes
        LEFT JOIN users usc ON tmes.usuarioCreacion=usc.id
        LEFT JOIN users usm ON tmes.usuarioModificacion=usm.id
        WHERE areas_id = ?`, area.id)
      reEspecialidades = [...reEspecialidades].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

      area.especialidades = reEspecialidades
    }

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getArea = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let reAreas = await connection.query(`
      SELECT tmar.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_areas tmar
      LEFT JOIN users usc ON tmar.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmar.usuarioModificacion=usm.id
      WHERE tmar.id=?`, id);
    reAreas = [...reAreas].map(item => {
      var tipoDesc = ""
      switch (item.tipo) {
        case "E":
          tipoDesc = "Especialidad"
          break;
        case "D":
          tipoDesc = "Diagnostico"
          break;
        case "N":
          tipoDesc = "Nanocredito"
          break;

        default:
          tipoDesc = ""
          break;
      }
      return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre, tipoDesc }
    })

    const result = reAreas[0]
    let reEspecialidades = await connection.query(`
      SELECT tmes.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_especialidad tmes
      LEFT JOIN users usc ON tmes.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmes.usuarioModificacion=usm.id
      WHERE areas_id = ?`, result.id)
    reEspecialidades = [...reEspecialidades].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    result.especialidades = reEspecialidades

    //const image = getOneFile(result[0].imagen);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = req.body;
    if (area.nombre === undefined) return res.status(400).json({ message: 'Bad Request' });

    area.usuarioModificacion = desencryptar(area.usuarioModificacion);
    area.fechaModificacion = moment().format(config.formats.dateTime);
    area.link = await crearLink(area.nombre);

    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_areas SET ? WHERE id=?`, [area, id]);
    const foundareas = await connection.query(`SELECT * FROM tmunay_areas WHERE id=?`, id);
    res.json({ body: foundareas[0] });
  } catch (error) {
    const { code } = error;

    if (code == "ER_DUP_ENTRY")
      res.status(409).json({ message: `e422` });
    else res.status(500).json({ message: "Ocurrió un error inesperado." });
  }
};

const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`DELETE FROM tmunay_areas WHERE id=?`, id);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAreasMuestreo = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT DISTINCT ar.* 
      FROM tmunay_areas ar, tmunay_especialidad esp, dicta_mentoria dm
      WHERE ar.estado = 1 and esp.estado = 1 and esp.areas_id=ar.id and dm.especialidad_id=esp.id`);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

/* Funciones */
function crearLink(nombre) {
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

export const methods = {
  addAreas,
  getAreas,
  getArea,
  updateArea,
  deleteArea,

  getAreasMuestreo
};
