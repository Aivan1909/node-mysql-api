import { getConnection } from '../database/database'


const PUBLIC_URL  = process.env.PUBLIC_URL

const _TABLA = "tmunay_testimonios"
const addTestimonios = async (req, res) => {
   //const {body ,file} = req
   console.log(req.body)
   try {
    const Testimonio = req.body
    const connection = await getConnection()
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, Testimonio)
    console.log(result)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getTestimonios = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT * FROM ${_TABLA}`)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getTestimonio = async (req, res) => {
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

const updateTestimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, imagen, testimonio, usuarioModificacion } = req.body;
    if (nombre === undefined)
      res.status(400).json({ message: "Bad Request" })

    const Testimonio = { nombre, apellidos, imagen, testimonio, usuarioModificacion }
    console.log(Testimonio)
    const connection = await getConnection()
    const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [Testimonio, id])
    res.json({ body: result[0] })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const deleteTestimonio = async (req, res) => {
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
  addTestimonios,
  getTestimonios,
  getTestimonio,
  updateTestimonio,
  deleteTestimonio
}