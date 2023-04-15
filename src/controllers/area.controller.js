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
    res.status(500);
    res.json(error.message);
  }
};

const getAreas = async (req, res) => {
  try {
    const connection = await getConnection();
    const reAreas = await connection.query(`SELECT * FROM tmunay_areas where estado = 1`);

    for (const area of reAreas) {
      const reEspecialidades = await connection.query(`SELECT * 
        FROM tmunay_especialidad WHERE estado=1 and areas_id = ?`, area.id)

      area.especialidades = reEspecialidades
    }

    res.json({ body: reAreas });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
};

const getArea = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const reAreas = await connection.query(`SELECT * FROM tmunay_areas WHERE id=? and estado = 1`, id);

    const result = reAreas[0]
    const reEspecialidades = await connection.query(`SELECT * 
        FROM tmunay_especialidad WHERE estado=1 and areas_id = ?`, result.id)

    result.especialidades = reEspecialidades

    //const image = getOneFile(result[0].imagen);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
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
    res.status(500);
    res.json(error.message);
  }
};

const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_areas WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getAreasMuestreo = async (req, res) => {
  try {
    const connection = await getConnection();
    const reAreas = await connection.query(`SELECT DISTINCT ar.* 
    FROM tmunay_areas ar, tmunay_especialidad esp, dicta_mentoria dm
    WHERE ar.estado = 1 and esp.estado = 1 and esp.areas_id=ar.id and dm.especialidad_id=esp.id`);

    res.json({ body: reAreas });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
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
