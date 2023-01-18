import { getConnection } from '../database/database'


const PUBLIC_URL  = process.env.PUBLIC_URL

const _TABLA  = "tmunay_equipo"
const _TABLA1 = "roless"
 const addEquipos = async (req, res) => {
   //const {body ,file} = req
   console.log(req.body)
   try {
    const Equipo = req.body
    const connection = await getConnection()
    const result = await connection.query(`INSERT INTO ${_TABLA} SET ?`, Ods)

    //Actualizamos el rol personal de Equipo
    let veri = `SELECT id  FROM ${_TABLA} as U  WHERE  EXISTS
               (SELECT * FROM ${_TABLA1} as R  WHERE U.id=req.id
                and R.rol_id=4)`
    const veriRol = await connection.query(veri)
    if(veriRol.recordset[0].id=null){
      await connection.query(`UPDATE ${_TABLA1} SET `, Ods)
    }
    
    console.log(result)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getEquipos = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT * FROM ${_TABLA}`)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getEquipo = async (req, res) => {
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

const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, imagen, usuarioModificacion } = req.body;
    if (nombre === undefined)
      res.status(400).json({ message: "Bad Request" })

    const Ods = { nombre, imagen, usuarioModificacion }
    console.log(Ods)
    const connection = await getConnection()
    const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [Ods, id])
    res.json({ body: result[0] })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const deleteEquipo = async (req, res) => {
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
  addOdss,
  getOdss,
  getOds,
  updateOds,
  deleteOds
}