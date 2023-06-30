import { getConnection } from '../database/database';


const addCampanas = async (req, res) => {
  try {
    const campana = req.body;
    campana.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    campana.estado = 1;
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_campanas SET ?`, campana);
    //const path = SaveOneFile({ mainFolder: 'campanaia', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_campanas SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCampanas = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_campanas where estdo = '1'`);
   // const foundcampanaiasWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCampana = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_campanas WHERE id=? and estado  = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateCampana = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, objetivo, descripcion, tipoMoneda, montoRequerido, fechaInicio, duracion, fechaFin, linkVideo, enlace, imagen1,imagen2 ,imagen3,  usuarioModificacion } = req.body;
        if (nombre === undefined) return res.status(400).json({ message: 'Bad Request' });
        const campana = { nombre, objetivo, descripcion, tipoMoneda, montoRequerido, fechaInicio, duracion, fechaFin, linkVideo, enlace, imagen1,imagen2 ,imagen3,  usuarioModificacion  };
        campana.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE tmunay_campanas SET ? WHERE id=?`, [campana, id]);
        const foundcampana = await connection.query(`SELECT * FROM tmunay_campanas WHERE id=?`, id);
        res.json({ body: foundcampana[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteCampana = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_campanas WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addCampanas,
  getCampanas,
  getCampana,
  updateCampana,
  deleteCampana,
};
