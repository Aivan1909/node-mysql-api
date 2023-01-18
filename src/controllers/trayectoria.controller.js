import { getConnection } from '../database/database'


const PUBLIC_URL  = process.env.PUBLIC_URL

const _TABLA = "tmunay_trayectoria"
const addTrayectorias = async (req, res) => {
   //const {body ,file} = req
   console.log(req.body)
   try {
    const trayectoria = req.body
    const connection = await getConnection()
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, trayectoria)
    console.log(result)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getTrayectorias = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT * FROM ${_TABLA}`)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getTrayectoria = async (req, res) => {
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

const updateTrayectoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, imagen, usuarioModificacion } = req.body;
    if (nombre === undefined)
      res.status(400).json({ message: "Bad Request" })

    const trayectoria = { nombre, imagen, usuarioModificacion }
    console.log(Trayectoria)
    const connection = await getConnection()
    const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [trayectoria, id])
    res.json({ body: result[0] })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const deleteTrayectoria = async (req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const connection = await getConnection()
    const result = await connection.query(`DELETE FROM ${_TABLA} WHERE id=?`,id)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

export const methods = {
  addTrayectorias,
  getTrayectorias,
  getTrayectoria,
  updateTrayectoria,
  deleteTrayectoria
}