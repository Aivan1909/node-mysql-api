import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_emprendimientos';
const _TABLA1 = 'emprendimientos_ods';
const addEmprendimiento = async (req, res) => {
  try {

    //Obteniendo las relaciones de las tablas relacionadas 
    const bkReferencia = req.body.referencia
    delete req.body.referencia
    const bkSectores = req.body.sectores
    delete req.body.sectores
    console.log(req.body)
    //ODS 
    let bkOds = req.body.ods;
    console.log(" ODS-> 1",bkOds)
    delete req.body.ods

    const Emprendimiento = req.body;
    Emprendimiento.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    Emprendimiento.estado = 2; // Estado Pendiente, debe ser aprobado por Admin
    const objImages = {}
    Emprendimiento.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, Emprendimiento);

    if (req.files) {
      [...req.files].forEach((item) => {
        objImages[item.fieldname] = SaveOneFile({ mainFolder: 'emprendimientos', idFolder: result.insertId, file: item });
      });
    }
    await connection.query(`UPDATE ${_TABLA} SET logo=?, fotoFundadores=?, fotoEquipo=?, documento=?, portada=? WHERE id=?`, [
      objImages['logo'] || null,
      objImages['fotoFundadores'] || null,
      objImages['fotoEquipo'] || null,
      objImages['documento'] || null,
      objImages['portada'] || null,

      result.insertId,
    ]);
    //Insercion de tablas relacionadas ODS 
    //Constante que recata el ID 
    console.log(result)
    const { insertId} =  await result;

   
    await bkOds.forEach (element => {
      const  idExternaOds  = {
        emprendimiento_id: insertId,
        ods_id: element
      } ;
      console.log("IDS->externos ->" , idExternaOds)
      connection.query(`INSERT INTO ${_TABLA1} SET ?`, idExternaOds);
    }); 

    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
};

const getEmprendimientos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    const foundEmprendimientosWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundEmprendimientosWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { emprendimiento } = req.body;
    if (emprendimiento === undefined) return res.status(400).json({ message: 'Bad Request' });
    const Emprendimiento = req.body;
    Emprendimiento.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [Emprendimiento, id]);
    const foundEmprendimiento = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImage = updateOneFile({ pathFile: foundEmprendimiento[0].imagen, file: req.file });
      if (responseUpdateImage)
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [responseUpdateImage, id]);
    }
    res.json({ body: foundEmprendimiento[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deleteEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const foundEmprendimiento = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (foundEmprendimiento.length > 0) {
      deleteOneFile(foundEmprendimiento[0].imagen);
    }
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body
    const connection = await getConnection();

    const result = connection.query(
      `UPDATE ${_TABLA} SET estado=? where id=?`,
      [estado, id]
    );
    console.log()

    res.json({ body: result })

  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}

export const methods = {
  addEmprendimiento,
  getEmprendimientos,
  getEmprendimiento,
  updateEmprendimiento,
  deleteEmprendimiento,
  cambiarEstado
};
