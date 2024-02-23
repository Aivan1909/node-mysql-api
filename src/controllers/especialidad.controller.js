import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const moment = require("moment")
const config = require('../config');
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const addEspecialidades = async (req, res) => {
  try {
    /* let bkArea = req.body.area;
    delete req.body.area; */
    const especialidad = req.body;
    especialidad.usuarioCreacion = desencryptar(especialidad.usuarioCreacion);
    especialidad.fechaCreacion = moment().format(config.formats.dateTime);
    especialidad.estado = 1;
    //especialidad.areas_id = bkArea;
    especialidad.link = await crearLink(especialidad.nombre);

    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_especialidad SET ?`, especialidad);

    if (req.file) {
      const path = await SaveOneFile({ mainFolder: 'especialidad', idFolder: result.insertId, file: req.file, targetSize: 500 });
      await connection.query(`UPDATE tmunay_especialidad SET imagen=? WHERE id=?`, [path, result.insertId]);
    }

    res.json({ body: result });
  } catch (error) {
    const { code } = error;

    if (code == "ER_DUP_ENTRY")
      res.status(409).json({ message: `e422` });
    else res.status(500).json({ message: "Ocurrió un error inesperado." });
  }
};

const getEspecialidades = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT e.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      , a.nombre as area 
      FROM tmunay_areas a, tmunay_especialidad e
      LEFT JOIN users usc ON e.usuarioCreacion=usc.id
      LEFT JOIN users usm ON e.usuarioModificacion=usm.id
      where a.id=e.areas_id`);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    const foundespecialidadsWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundespecialidadsWithImages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT e.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_especialidad e
      LEFT JOIN users usc ON e.usuarioCreacion=usc.id
      LEFT JOIN users usm ON e.usuarioModificacion=usm.id
      WHERE e.id=?`, id);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const especialidad = req.body;
    if (especialidad.nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    especialidad.usuarioModificacion = desencryptar(especialidad.usuarioModificacion);
    especialidad.fechaModificacion = moment().format(config.formats.dateTime);
    especialidad.link = await crearLink(especialidad.nombre);

    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_especialidad SET ? WHERE id=?`, [especialidad, id]);
    const foundEspecialidad = await connection.query(`SELECT * FROM tmunay_especialidad WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImage = updateOneFile({ pathFile: foundEspecialidad[0].imagen, file: req.file, targetSize: 500 });
      if (responseUpdateImage)
        await connection.query(`UPDATE tmunay_especialidad SET imagen=? WHERE id=?`, [responseUpdateImage, id]);
    }
    res.json({ body: foundEspecialidad[0] });
  } catch (error) {
    const { code } = error;

    if (code == "ER_DUP_ENTRY")
      res.status(409).json({ message: `e422` });
    else res.status(500).json({ message: "Ocurrió un error inesperado." });
  }
};

const deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_especialidad WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Obtencion de especialidades en base al area:
const getEspecialidadesArea = async (req, res) => {
  try {
    const { linkArea, idMentor } = req.params;
    const { mentores } = req.body;
    console.log(mentores)

    const connection = await getConnection();

    let query = `SELECT es.*
    FROM tmunay_areas ar, tmunay_especialidad es, dicta_mentoria dm
    WHERE es.estado=1 AND ar.estado=1 AND es.areas_id=ar.id`;
    let predicado = [];

    if (linkArea != null || typeof (linkArea) == 'undefined') {
      query += " AND ar.link= ?"
      predicado.push(linkArea)

      if (typeof (mentores) != 'undefined') {
        query += " AND dm.especialidad_id = es.id"
      }
    }
    const result = await connection.query(query, predicado);

    const foundespecialidadsWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundespecialidadsWithImages });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}
// Obtencion de capsulas agrupadas por especialidad
const getEspecialidadesCapsula = async (req, res) => {
  try {
    const connection = await getConnection();
    const especialidades = await connection.query('select * from tmunay_especialidad')

    for (const especialidad of especialidades) {
      especialidad.capsulas = await connection.query(`SELECT * 
        FROM tmunay_capsulas
        WHERE especialidad_id = ?`, especialidad.id)
    }

    res.json({ body: especialidades });
  } catch (error) {
    console.log("getEspecialidadesCapsula", error)
    res.status(500).json(error.message);
  }
}

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
  addEspecialidades,
  getEspecialidades,
  getEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,

  getEspecialidadesArea,
  getEspecialidadesCapsula
};
