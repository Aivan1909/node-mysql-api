import { getConnection } from '../database/database';
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const addComentario = async (req, res) => {
  try {
    const Comentario = req.body;

    Comentario.emprendimientos_id = desencryptar(Comentario.emprendimientos_id)
    Comentario.estado = 1;
    Comentario.user_id = desencryptar(Comentario.user_id)
    Comentario.usuarioCreacion = Comentario.user_id
    Comentario.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');

    const connection = await getConnection();
    const verifica = await connection.query(`SELECT * FROM tmunay_comentarios WHERE user_id=? and emprendimientos_id=?`, [Comentario.user_id, Comentario.emprendimientos_id]);

    if (verifica?.length === 1) {
      res.status(409).json({ mensaje: "e423" });
    } else {
      const result = await connection.query(`INSERT INTO tmunay_comentarios SET ?`, Comentario);

      res.json({ body: result });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}
const getComentarios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_comentarios where estado=1`);

    result = result.map(obj => { return { ...obj, user_id: encryptar(obj.user_id) } })
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
}
const getComentario = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_comentarios WHERE id=?`, id);
    if (result.length === 0) return res.status(404).json({ mensaje: "e404" });

    res.json({ body: result[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
}
const updateComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, usuarioModificacion } = req.body;
    if (descripcion === undefined) res.status(400).json({ message: 'Bad Request' });

    const Comentario = { descripcion, usuarioModificacion };
    const connection = await getConnection();
    const result = await connection.query(`UPDATE tmunay_comentarios SET ? WHERE id=?`, [Comentario, id]);

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const deleteComentario = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_comentarios WHERE id=?`, id);

    res.json({ body: result });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}

export const methods = {
  addComentario,
  getComentarios,
  getComentario,
  updateComentario,
  deleteComentario
}