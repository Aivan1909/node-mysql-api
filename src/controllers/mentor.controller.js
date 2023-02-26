import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_mentores';
const _TABLA1 = 'horario_mentoria'
//const _TABLA1 = 'horario_mentor';
const _TABLA2 = 'area_mentor';
const _TABLA3 = 'especialidad_mentor';
const _TABLA4 = 'tmunay_horarios';
const _TABLA5 = 'users';



const addMentores = async (req, res) => {
  try {
    //Horario
    const bkHorario = req.body.horario
    delete req.body.horario

    const bkEspecialidad = req.body.especialidad
    delete req.body.especialidad

    const mentor = req.body;
    mentor.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, mentor);

    const { insertId} =  await result;
 
    //Insertando  el id  especialidad
    await bkEspecialidad.forEach (element => {
    const  idExternaEspecialidad  = {
        mentor_id: insertId,
        especialidad_id: element
        } ;
        //console.log("IDS->externos ->" , idExternaHorario)
        connection.query(`INSERT INTO ${_TABLA3} SET ?`, idExternaEspecialidad);
     });

    //Insertando  los horarios del mentor
    await bkHorario.forEach (element => {
      const  idExternaHorario  = {
        mentores_id: insertId,
        dia: element.dia,
        hora1: element.hora1,
        hora2: element.hora2
        //horarios_id: element
      } ;
      idExternaHorario.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
      idExternaHorario.estado =1;
      //console.log("IDS->externos ->" , idExternaHorario)
      connection.query(`INSERT INTO ${_TABLA4} SET ?`, idExternaHorario);
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


const getListaMentorEsp = async (req, res) => {
  console.log('holaaaa->>>>>>')
  try {
    const connection = await getConnection();
    let sql = `SELECT  A.id, concat(D.nombre ,' ', D.apellidos) as nombres , C.duracion, A.online
               FROM ${_TABLA} A
               INNER JOIN ${_TABLA1} B ON A.id = B.mentores_id
               INNER JOIN ${_TABLA4} C ON B.horarios_id = C.id
               INNER JOIN ${_TABLA5} D ON A.user_id = D.id
               WHERE A.tipo = 'E'`
    const result = await connection.query(sql);


    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};



const getListaMentorD = async (req, res) => {
  try {
    const connection = await getConnection();
    let sql = `SELECT  A.id, concat(D.nombre ,' ', D.apellidos) as nombres , C.duracion, A.online
               FROM ${_TABLA} A
               INNER JOIN ${_TABLA1} B ON A.id = B.mentores_id
               INNER JOIN ${_TABLA4} C ON B.horarios_id = C.id
               INNER JOIN ${_TABLA5} D ON A.user_id = D.id
               WHERE A.tipo = 'D'`;
    const result = await connection.query(sql);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

/* const getMentorFechaHorario= async (req, res) => {
  try {
    const { fecha } = req.params;
    const connection = await getConnection();
    let sql1 = `SELECT  A.user_id, CONCAT(B.nombre , ' ', B.apellidos) AS nombres
                FROM ${_TABLA} A, ${_TABLA5} B
                WHERE A.user_id = B.id`
    const result = await connection.query(sql1);
 
    let resulF;
    result.forEach(element => {
       const { user_id, nombres  } = element;
       let sql2 = `SELECT D.fecha, D.hora1, D.hora2
                   FROM mentoria_mentor A, tmunay_mentorias B, horario_mentoria C,  tmunay_horarios D 
                   WHERE A.mentorias_id = B.id and  B.id = C.mentorias_id and  C.horarios_id = D.id
                   and A.mentores_id = 1 and DATE_FORMAT(D.fecha, '%Y-%m-%d') = '2023-02-21'`
    });

    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}; */





export const methods = {
  addMentores,
  getMentores,
  getMentor,
  getListaMentorEsp,
  getListaMentorD,
  updateMentor,
  deleteMentor
};
