import { getConnection } from '../database/database'


const _TABLA = "tmunay_alianzas"
const addAlianza = async (req, res) => {
  try {
    console.log(req.body)
    const connection = await getConnection()
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, alianza)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getAlianzas = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT * FROM ${_TABLA}`)
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
    const result = await connection.query(`SELECT * FROM ${_TABLA} WHERE id=?`, id)
    res.json({ body: result[0] })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const updateAlianza = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, enlace, imagen, usuarioModificacion } = req.body;
    if (nombre === undefined)
      res.status(400).json({ message: "Bad Request" })

    const alianza = { nombre, enlace, imagen, usuarioModificacion }
    console.log(alianza)
    const connection = await getConnection()
    const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [alianza, id])
    res.json({ body: result[0] })
  } catch (error) {
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