import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL

const _TABLA = "tmunay_equipo"
const _TABLA1 = "tmunay_asesor"
const _TABLA2 = "tmunay_trayectoria"
const _TABLA3 = "tmunay_colaboradores"
const _TABLA4 = "tmunay_alianzas"
const _TABLA5 = "users"
const _TABLA6 = "tmunay_testimonios"


const getSobreMunay = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT  CONCAT(A.nombre,' ',A.apellidos) AS nombre,B.cargo,B.imagen,B.redSocial `
    sql1 = sql1 + ` FROM  ${_TABLA5} A LEFT JOIN ${_TABLA} B ON A.id = B.user_id`
    const equipo = await connection.query(sql1)

    let sql2 = `SELECT concat(nombres,' ',apellidos) AS nombre, cargo, redSocial,imagen FROM ${_TABLA1}`
    const asesor = await connection.query(sql2)

    let sql3 = `SELECT nombre,imagen FROM ${_TABLA2}`
    const trayectoria = await connection.query(sql3)

    let sql4 = `SELECT nombre,imagen FROM ${_TABLA3}`
    const colaborador = await connection.query(sql4)

    let sql5 = `SELECT nombre, imagen FROM ${_TABLA4}`
    const alianza = await connection.query(sql5)

    //const result = {}[equipo,asesor,trayectoria,colaborador,alianza]
    const result = { 'equipo': equipo, 'asesor': asesor, 'trayectoria': trayectoria, 'colaborador': colaborador, 'alianza': alianza }

    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

const getInicio = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql2 = `SELECT nombre,testimonio,imagen FROM ${_TABLA6}`
    const result = await connection.query(sql2)
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

export const methods = { getSobreMunay, getInicio }