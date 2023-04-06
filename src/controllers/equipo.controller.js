import { getConnection } from '../database/database'
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const PUBLIC_URL = process.env.PUBLIC_URL

const _TABLA = "tmunay_equipo"
const _TABLA1 = "users"
const addEquipo = async (req, res) => {
  //const {body ,file} = req
  try {
    const equipo = req.body
    equipo.user_id = desencryptar(equipo.user_id)
    equipo.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');

    const connection = await getConnection()
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, equipo)
    const path = SaveOneFile({ mainFolder: 'equipo', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, result.insertId]);

    //Actualizamos el rol personal de Equipo
    /* let veri = `SELECT id  FROM ${_TABLA} as U  WHERE  EXISTS
               (SELECT * FROM ${_TABLA1} as R  WHERE U.id=req.id
                and R.rol_id=4)`
    const veriRol = await connection.query(veri)
    if (veriRol.recordset[0].id = null) {
      await connection.query(`UPDATE ${_TABLA1} SET `, Ods)
    } */

    console.log(result)
    res.json({ body: result })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error.message)
  }
}

const getEquipos = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT e.*, u.nombre, u.apellidos, u.email FROM ${_TABLA} e, ${_TABLA1} u where u.id = e.user_id`)
    const foundEquiposWithImages = await [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundEquiposWithImages })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection()
    const result = await connection.query(`SELECT e.*, u.nombre, u.apellidos, u.email FROM ${_TABLA} e, ${_TABLA1} u where u.id = e.user_id and e.id=?`, id)
    console.log(result)
    if (!result.length > 0) return res.status(404);
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, cargo, redSocial, imagen, usuarioModificacion } = req.body;
    if (user_id === undefined)
      res.status(400).json({ message: "Bad Request" })

    const equipo = { user_id: desencryptar(user_id), cargo, redSocial, usuarioModificacion }
    equipo.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    console.log(equipo)
    const connection = await getConnection()
    await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [equipo, id])
    const foundEquipo = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundEquipo[0].imagen, file: imagen });
      if (responseUpdateImagen)
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      else {
        const path = SaveOneFile({ mainFolder: 'trayectoria', idFolder: foundEquipo[0].id, file: req.file });
        await connection.query(`UPDATE ${_TABLA} SET imagen=? WHERE id=?`, [path, foundEquipo[0].id]);
      }
    }
    res.json({ body: foundEquipo[0] })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error.message)
  }
}

const deleteEquipo = async (req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const connection = await getConnection()
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`, id)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

export const methods = {
  addEquipo,
  getEquipos,
  getEquipo,
  updateEquipo,
  deleteEquipo
}