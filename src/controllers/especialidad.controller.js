import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';


const addEspecialidades = async (req, res) => {
  try {
    let bkArea = req.body.area;
    delete req.body.area;
    const especialidad = req.body;
    especialidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    especialidad.estado = 1;
    especialidad.areas_id = bkArea;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_especialidad SET ?`, especialidad);
    const path = SaveOneFile({ mainFolder: 'especialidad', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE tmunay_especialidad SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
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
      WHERE id=?`, id);
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
    const { nombre, descripcion } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const especialidads = { nombre, descripcion };
    especialidads.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_especialidad SET ? WHERE id=?`, [especialidads, id]);
    const foundEspecialidad = await connection.query(`SELECT * FROM tmunay_especialidad WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImage = updateOneFile({ pathFile: foundEspecialidad[0].imagen, file: req.file });
      if (responseUpdateImage)
        await connection.query(`UPDATE tmunay_especialidad SET imagen=? WHERE id=?`, [responseUpdateImage, id]);
    }
    res.json({ body: foundEspecialidad[0] });
  } catch (error) {
    res.status(500).json(error.message);
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

export const methods = {
  addEspecialidades,
  getEspecialidades,
  getEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,

  getEspecialidadesArea
};
