import { getConnection } from '../database/database'
const config = require('./../config')


const PUBLIC_URL  = process.env.PUBLIC_URL

const _TABLA = "tmunay_alianzas"
const addAlianza = async (req, res) => {
  try {
    console.log("BODY ", req.body)
    const { nombre, enlace, imagen, usuarioCreacion } = req.body;
    const alianza = { nombre, enlace, estado: 'activo', usuarioCreacion };

    const connection = await getConnection()
    //let sql  = `INSERT INTO ${_TABLA}(nombre,enlace,imagen,estado,usuarioCreacion,fechaCreacion, usuarioModificacion,fechaModificacion) VALUES(?,?,?,?,?,?,?,?)`
    //const result = await connection.query(sql,[nom,enl,img,est,usr,fc,usr,fm])
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, alianza)
    console.log(result)
    res.json({ body: result })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error.message)
  }
}

const getAlianzas = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT id, nombre, enlace, CONCAT('${config.app.serverUrl}', imagen) as imagen, estado, usuarioCreacion, fechaCreacion, usuarioModificacion FROM ${_TABLA}`)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getAlianza = async (req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const connection = await getConnection()
    const result = await connection.query(`SELECT id, nombre, enlace, CONCAT('${config.app.serverUrl}', imagen) as imagen, estado, usuarioCreacion, fechaCreacion, usuarioModificacion FROM ${_TABLA} WHERE id=?`, id)
    res.json({ body: result[0] })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error.message)
  }
}

const updateAlianza = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, enlace, usuarioModificacion } = req.body;
    let alianza = { nombre, enlace, usuarioModificacion }

    if (req.file) {
      const { destination, filename } = req.file
      let nuevaImagen = destination.replace('src/public/', '') + "/" + filename
      alianza.imagen = nuevaImagen
    }

    if (nombre === undefined)
      res.status(400).json({ message: "Bad Request" })

    console.log(alianza)
    const connection = await getConnection()
    const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [alianza, id])
    res.json({ body: result[0] })
  } catch (error) {
    console.log("error", error)
    res.status(500)
    res.json(error.message)
  }
}

const deleteAlianza = async (req, res) => {
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
  addAlianza,
  getAlianzas,
  getAlianza,
  updateAlianza,
  deleteAlianza
}