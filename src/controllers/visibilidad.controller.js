import { getConnection } from '../database/database';
import { desencryptar } from '../middleware/crypto.mld';


const addvisibilidades = async (req, res) => {
  try {
    const { plataforma, publicidad, emprendimiento_id } = req.body
    const existe = await validaVisibilidad(emprendimiento_id)
    console.log(existe)
    if (!existe) {
      //Obtencion de claves foraneas o externas
      //Plataforma
      let bkPlataforma = plataforma;
      delete req.body.plataforma
      //Publicidad
      let bkPublicidad = publicidad;
      delete req.body.publicidad

      const visibilidad = req.body;
      visibilidad.fecha_inicio = require('moment')().format('YYYY-MM-DD HH:mm:ss');
      visibilidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
      visibilidad.usuarioCreacion = desencryptar(visibilidad.usuarioCreacion);
      visibilidad.estado = 2; // Estado Pendiente

      const connection = await getConnection();
      let result = await connection.query(`INSERT INTO tmunay_visibilidad SET ?`, visibilidad);

      const { insertId } = await result;

      //insertando a la tabla Plataforma
      for await (let plataf of bkPlataforma) {
        for (const publi of bkPublicidad) {
          const idExternaPlataforma = {
            visibilidad_id: insertId,
            plataforma_id: plataf,
            publicidad_id: publi
          }

          connection.query(`INSERT INTO plataforma_visibilidad SET ?`, idExternaPlataforma);
        }

      };

      res.json({ body: result });
    } else {
      res.status(409).json({ mensaje: "e428" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getvisibilidades = async (req, res) => {
  try {
    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmv.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      , tme.emprendimiento
      FROM tmunay_emprendimientos tme, tmunay_visibilidad tmv
      LEFT JOIN users usc ON tmv.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmv.usuarioModificacion=usm.id
      WHERE tme.id=tmv.emprendimiento_id`);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    for (const item of result) {
      item.plataformas = await connection.query(`SELECT distinct tmp.id, tmp.nombre
      FROM plataforma_visibilidad pv, tmunay_plataforma tmp
      WHERE pv.plataforma_id=tmp.id and pv.visibilidad_id=?`, item.id);

      item.publicidades = await connection.query(`SELECT distinct tmp.id, tmp.nombre
      FROM plataforma_visibilidad pv, tmunay_publicidad tmp
      WHERE pv.publicidad_id=tmp.id and pv.visibilidad_id=?`, item.id);
    }

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getvisibilidad = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    let result = await connection.query(`
      SELECT tmv.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      , tme.emprendimiento
      FROM tmunay_emprendimientos tme, tmunay_visibilidad tmv
      LEFT JOIN users usc ON tmv.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmv.usuarioModificacion=usm.id
      WHERE tme.id=tmv.emprendimiento_id AND tmv.id=?`, id);
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });

    result[0].plataformas = await connection.query(`SELECT distinct tmp.id, tmp.nombre
      FROM plataforma_visibilidad pv, tmunay_plataforma tmp
      WHERE pv.plataforma_id=tmp.id and pv.visibilidad_id=?`, result[0].id);

    result[0].publicidades = await connection.query(`SELECT distinct tmp.id, tmp.nombre
      FROM plataforma_visibilidad pv, tmunay_publicidad tmp
      WHERE pv.publicidad_id=tmp.id and pv.visibilidad_id=?`, result[0].id);

    res.json({ body: result[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const updatevisibilidad = async (req, res) => {
  try {
    const { id } = req.params;

    const nuevaData = req.body
    nuevaData.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');

    const connection = await getConnection();
    const result = await connection.query(`UPDATE tmunay_visibilidad SET ? WHERE id=?`, [nuevaData, id]);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const deletevisibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_visibilidad WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Auxiliares
async function validaVisibilidad(id) {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_visibilidad where estado IN (1, 2) AND emprendimiento_id= ?`, id);

    return result.length > 0
  } catch (error) {
    throw new Error(error);
  }
}

export const methods = {
  addvisibilidades,
  getvisibilidades,
  getvisibilidad,
  updatevisibilidad,
  deletevisibilidad
};
