import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_emprendimientos';
const _TABLA1 = 'emprendimientos_ods';
const _TABLA2 = 'emprendimientos_sector';
const _TABLA3 = 'criterios_emprendimientos';
const _TABLA4 = 'areas_emprendimientos';
const _TABLA5 = 'emprendimientos_medios';
const _TABLA6 = 'emprendimiento_suscripcion';
const _TABLA7 = 'emprendimiento_visibilidad';

const addEmprendimiento = async (req, res) => {
  try {
    //Obtencion de claves foraneas o externas
    //ODS 
    let bkOds = req.body.ods;
    delete req.body.ods
    //Sectores
    let bkSectores = req.body.sectores
    delete req.body.sectores
    //Criterios
    let bkCriterios = req.body.criterios
    delete req.body.criterios
    //Areas
    let bkAreas = req.body.areas
    delete req.body.areas
    //Medios - > [Referencia]
    const bkMedios = req.body.medios
    delete req.body.medios
    //Suscripcion 
    const bkSuscripcion = req.body.suscripcion
    delete req.body.suscripcion
    //Visibilidad 
    const bkVisibilidad = req.body.visibilidad
    delete req.body.visibilidad

    

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
    //console.log(result)
    const { insertId} =  await result;

    //Generando  el  codigo Emprendimeinto
    let cod = insertId.toString();
    let codigo = 'D-'.concat(cod.padStart(7,0)) 
    await connection.query(`UPDATE ${_TABLA}  SET codigo = ? WHERE id =?`,[codigo,insertId]);

   //Insertando  el id Relacional ODS
    await bkOds.forEach (element => {
      const  idExternaOds  = {
        emprendimiento_id: insertId,
        ods_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaOds)
      connection.query(`INSERT INTO ${_TABLA1} SET ?`, idExternaOds);
    }); 
   //Insertando  el id Relacional Sectores
   await bkSectores.forEach (element => {
    const  idExternaSector  = {
      emprendimiento_id: insertId,
      sectores_id: element
    } ;
    //console.log("IDS->externos ->" , idExternaSector)
    connection.query(`INSERT INTO ${_TABLA2} SET ?`, idExternaSector);
  }); 

     //Insertando  el id Relacional Criterios 
     await bkCriterios.forEach (element => {
      const  idExternaCriterios  = {
        emprendimiento_id: insertId,
        criterios_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaCriterios)
      connection.query(`INSERT INTO ${_TABLA3} SET ?`, idExternaCriterios);
    }); 

     //Insertando  el id Relacional Areas
     await bkAreas.forEach (element => {
      const  idExternaAreas  = {
        emprendimiento_id: insertId,
        area_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaAreas)
      connection.query(`INSERT INTO ${_TABLA4} SET ?`, idExternaAreas);
    }); 
     //Insertando  el id Relacional Medios [Referencia]
     await bkMedios.forEach (element => {
      const  idExternaMedios  = {
        emprendimiento_id: insertId,
        medio_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaMedios)
      connection.query(`INSERT INTO ${_TABLA5} SET ?`, idExternaMedios);
    });
     //Insertando  el id Relacional Suscripcion 
     await bkSuscripcion.forEach (element => {
      const  idExternaSuscripcion  = {
        emprendimiento_id: insertId,
        suscripcion_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaSuscripcion)
      connection.query(`INSERT INTO ${_TABLA6} SET ?`, idExternaSuscripcion);
    });
     //Insertando  el id Relacional Visibilidad
     await bkVisibilidad.forEach (element => {
      const  idExternaVisibilidad  = {
        emprendimiento_id: insertId,
        visibilidad_id: element
      } ;
      console.log("IDS->externos ->" , idExternaVisibilidad)
      connection.query(`INSERT INTO ${_TABLA7} SET ?`, idExternaVisibilidad);
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
