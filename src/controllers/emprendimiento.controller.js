import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const sgMail = require('@sendgrid/mail');
const config = require('../config');

const _TABLA2 = 'emprendimientos_sector';
const _TABLA5 = 'emprendimientos_medios';

const addEmprendimiento = async (req, res) => {
  try {
    //Sectores
    let bkSectores = JSON.parse(req.body.sectores)
    delete req.body.sectores

    //Medios - > [Referencia]
    const bkMedios = JSON.parse(req.body.referencia)
    delete req.body.referencia

    const Emprendimiento = req.body;
    //ID de usuario al que corresponde el emprendimiento
    Emprendimiento.user_id = desencryptar(req.body.user_id)
    delete req.body.user_id

    Emprendimiento.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    Emprendimiento.estado = 2; // Estado Pendiente, debe ser aprobado por Admin

    const objImages = {}
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_emprendimientos SET ?`, Emprendimiento);

    //Constante que recata el ID 
    const { insertId } = await result;

    if (req.files) {
      [...req.files].forEach((item) => {
        objImages[item.fieldname] = SaveOneFile({ mainFolder: 'emprendimientos', idFolder: insertId, file: item });
      });
    }
    await connection.query(`UPDATE tmunay_emprendimientos SET logo=?, fotoFundadores=?, fotoEquipo=?, documento=?, portada=? WHERE id=?`, [
      objImages['logo'] || null,
      objImages['fotoFundadores'] || null,
      objImages['fotoEquipo'] || null,
      objImages['documento'] || null,
      objImages['portada'] || null,

      insertId,
    ]);
    //Insercion de tablas relacionadas ODS 

    //Generando  el  codigo Emprendimeinto
    let cod = insertId.toString();
    let codigo = 'D-'.concat(cod.padStart(7, 0))
    await connection.query(`UPDATE tmunay_emprendimientos  SET codigo = ? WHERE id =?`, [codigo, insertId]);

    //Insertando  el id Relacional ODS
    /* await bkOds.forEach(element => {
      const idExternaOds = {
        emprendimiento_id: insertId,
        ods_id: element
      };
      //console.log("IDS->externos ->" , idExternaOds)
      connection.query(`INSERT INTO ${_TABLA1} SET ?`, idExternaOds);
    }); */
    //Insertando  el id Relacional Sectores
    for (let element of bkSectores) {
      const idExternaSector = {
        emprendimiento_id: insertId,
        sectores_id: element
      };
      //console.log("IDS->externos ->" , idExternaSector)
      connection.query(`INSERT INTO ${_TABLA2} SET ?`, idExternaSector);
    };

    //Insertando  el id Relacional Criterios 
    /* await bkCriterios.forEach(element => {
      const idExternaCriterios = {
        emprendimiento_id: insertId,
        criterios_id: element
      };
      //console.log("IDS->externos ->" , idExternaCriterios)
      connection.query(`INSERT INTO ${_TABLA3} SET ?`, idExternaCriterios);
    }); */

    //Insertando  el id Relacional Areas
    /* await bkAreas.forEach(element => {
      const idExternaAreas = {
        emprendimiento_id: insertId,
        area_id: element
      };
      //console.log("IDS->externos ->" , idExternaAreas)
      connection.query(`INSERT INTO ${_TABLA4} SET ?`, idExternaAreas);
    }); */
    //Insertando  el id Relacional Medios [Referencia]
    for (let element of bkMedios) {
      const idExternaMedios = {
        emprendimiento_id: insertId,
        medio_id: element
      };
      //console.log("IDS->externos ->" , idExternaMedios)
      connection.query(`INSERT INTO ${_TABLA5} SET ?`, idExternaMedios);
    };
    //Insertando  el id Relacional Suscripcion 
    /* await bkSuscripcion.forEach(element => {
      const idExternaSuscripcion = {
        emprendimiento_id: insertId,
        suscripcion_id: element
      };
      //console.log("IDS->externos ->" , idExternaSuscripcion)
      connection.query(`INSERT INTO ${_TABLA6} SET ?`, idExternaSuscripcion);
    }); */
    //Insertando  el id Relacional Visibilidad
    /* await bkVisibilidad.forEach(element => {
      const idExternaVisibilidad = {
        emprendimiento_id: insertId,
        visibilidad_id: element
      };
      console.log("IDS->externos ->", idExternaVisibilidad)
      connection.query(`INSERT INTO ${_TABLA7} SET ?`, idExternaVisibilidad);
    }); */


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
    const result = await connection.query(`SELECT * FROM tmunay_emprendimientos`);
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
    const result = await connection.query(`SELECT * FROM tmunay_emprendimientos WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getEmprendimientoUser = async (req, res) => {
  try {
    const { id } = req.body;
    const id_user = desencryptar(id);
    const connection = await getConnection();
    const result = await connection.query(
      `SELECT e.*, sp.id suscripcion_id, sp.nit, sp.razonSocial, sp.correo, sp.fechaInicio, sp.fechaFin
      FROM tmunay_emprendimientos e
      LEFT JOIN (SELECT su.*, pl.nombre nombre_plan 
        FROM tmunay_suscripcion su, tmunay_planes pl
        WHERE su.plan_id = pl.id) sp ON sp.emprendimiento_id = e.id
      WHERE e.user_id=?`
      , id_user);
    if (!result.length > 0) return res.status(404);
    result[0].logo = getOneFile(result[0].logo);
    res.json({ body: result[0] });
  } catch (error) {
    console.log(error)
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
    await connection.query(`UPDATE tmunay_emprendimientos SET ? WHERE id=?`, [Emprendimiento, id]);
    const foundEmprendimiento = await connection.query(`SELECT * FROM tmunay_emprendimientos WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImage = updateOneFile({ pathFile: foundEmprendimiento[0].imagen, file: req.file });
      if (responseUpdateImage)
        await connection.query(`UPDATE tmunay_emprendimientos SET imagen=? WHERE id=?`, [responseUpdateImage, id]);
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
    const foundEmprendimiento = await connection.query(`SELECT * FROM tmunay_emprendimientos WHERE id=?`, id);
    if (foundEmprendimiento.length > 0) {
      deleteOneFile(foundEmprendimiento[0].imagen);
    }
    const result = await connection.query(`DELETE FROM tmunay_emprendimientos WHERE id=?`, id);
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
      `UPDATE tmunay_emprendimientos SET estado=? where id=?`,
      [estado, id]
    );
    console.log()

    res.json({ body: result })

  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}

const sendEmail = async (req, res) => {
  const { ...rest } = req.body;
  let destinatario = rest.destinatario;
  let asunto = rest.asunto;
  let textEmail = rest.textEmail;
  let response = await emailSender(destinatario, asunto, textEmail);

  if (!response?.errorEmail) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }

};

const emailSender = async (destinatario, asunto, textEmail) => {
  let responseEmail;
  sgMail.setApiKey(config.emailSendGridConfig.apiKey);
  const mensaje = {
    to: destinatario,
    from: config.emailSendGridConfig.senderName,
    subject: asunto,
    html: `<strong>${textEmail}</strong>`,
  }

  responseEmail = sgMail
    .send(mensaje)
    .then((response) => {
      return { statusCodeEmail: response[0].statusCode, message: 'enviado' };
    })
    .catch((error) => {
      return { errorMessage: error?.message, errorBody: error?.response?.body, message: 'no enviado' };
    });

  return responseEmail;
}

export const methods = {
  addEmprendimiento,
  getEmprendimientos,
  getEmprendimiento,
  getEmprendimientoUser,
  updateEmprendimiento,
  deleteEmprendimiento,
  cambiarEstado,
  sendEmail,
};
