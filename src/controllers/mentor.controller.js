import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_mentores';
const _TABLA1 = 'horario_mentor';
const _TABLA2 = 'area_mentor';
const _TABLA3 = 'especialidad_mentor';



const addMentores = async (req, res) => {
  try {
    //Horario
    const bkHorario = req.body.horario
    delete req.body.horario
    //AreaMentor
    const bkArea = req.body.area
    delete req.body.area

    const bkEspecialidad = req.body.especialidad
    delete req.body.especialidad

    const mentor = req.body;
    mentor.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, mentor);

    const { insertId} =  await result;
    //Insertando  el id Relacional Horario
    await bkHorario.forEach (element => {
      const  idExternaHorario  = {
        mentores_id: insertId,
        horarios_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaHorario)
      connection.query(`INSERT INTO ${_TABLA1} SET ?`, idExternaHorario);
    });
      //Insertando  el id Relacional Horario
    await bkArea.forEach (element => {
      const  idExternaArea  = {
        mentor_id: insertId,
        area_id: element
      } ;
      //console.log("IDS->externos ->" , idExternaHorario)
      connection.query(`INSERT INTO ${_TABLA2} SET ?`, idExternaArea);
    });

    //Insertando  el id Relacional Horario
    await bkEspecialidad.forEach (element => {
    const  idExternaEspecialidad  = {
        mentor_id: insertId,
        especialidad_id: element
        } ;
        //console.log("IDS->externos ->" , idExternaHorario)
        connection.query(`INSERT INTO ${_TABLA3} SET ?`, idExternaEspecialidad);
     });

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentores = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA}`);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updateMentor = async (req, res) => {
    try {
        const { id } = req.params;
        const { curriculum ,user_id, tipo ,usuarioModificacion } = req.body;
        if (user_id === undefined) return res.status(400).json({ message: 'Bad Request' });
        const mentors = { curriculum, user_id,tipo,usuarioModificacion };
        mentors.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [mentors, id]);
        const foundmentors = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
        res.json({ body: foundmentors[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

export const methods = {
  addMentores,
  getMentores,
  getMentor,
  updateMentor,
  deleteMentor,
};
