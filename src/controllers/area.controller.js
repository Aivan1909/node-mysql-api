import { getConnection } from '../database/database';

const addAreas = async (req, res) => {
  try {

    const area = req.body;
    area.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    area.estado = 1;

    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_areas SET ?`, area);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
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
    result = [...result].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

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
    console.log(error)
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
      WHERE id=?`, id);
    reAreas = [...reAreas].map(item => { return { ...item, usuarioCreacion: item.usuarioCreacionNombre, usuarioModificacion: item.usuarioModificacionNombre } })

    const result = reAreas[0]
    let reEspecialidades = await connection.query(`
      SELECT tmes.*, CONCAT(usc.nombre, ' ', usc.apellidos) AS usuarioCreacionNombre, CONCAT(usm.nombre, ' ', usm.apellidos) AS usuarioModificacionNombre
      FROM tmunay_especialidad tmes
      LEFT JOIN users usc ON tmes.usuarioCreacion=usc.id
      LEFT JOIN users usm ON tmes.usuarioModificacion=usm.id
      WHERE estado=1 and areas_id = ?`, result.id)
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
    const { nombre, descripcionArea } = req.body;
    if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
    const areas = { nombre, descripcionArea };
    areas.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_areas SET ? WHERE id=?`, [areas, id]);
    const foundareas = await connection.query(`SELECT * FROM tmunay_areas WHERE id=?`, id);
    res.json({ body: foundareas[0] });
  } catch (error) {
    res.status(500).json(error.message);
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
    console.log(error)
    res.status(500).json(error.message);
  }
};

export const methods = {
  addAreas,
  getAreas,
  getArea,
  updateArea,
  deleteArea,

  getAreasMuestreo
};
