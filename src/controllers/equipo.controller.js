import { getConnection } from '../database/database'
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';
import { encryptar, desencryptar } from '../middleware/crypto.mld';
import { emailSender } from '../middleware/email.mdl'


const addEquipo = async (req, res) => {
  //const {body ,file} = req
  try {
    const equipo = req.body
    equipo.user_id = desencryptar(equipo.user_id)
    equipo.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');

    console.log(equipo)
    const connection = await getConnection()
    const result = await connection.query(`INSERT INTO tmunay_equipo SET ?`, equipo)
    const path = SaveOneFile({ mainFolder: 'equipo', idFolder: result.insertId, file: req.file });
    await connection.query(`UPDATE tmunay_equipo SET imagen=? WHERE id=?`, [path, result.insertId]);

    //Actualizamos el rol personal de Equipo
    /* let veri = `SELECT id  FROM tmunay_equipo as U  WHERE  EXISTS
               (SELECT * FROM users as R  WHERE U.id=req.id
                and R.rol_id=4)`
    const veriRol = await connection.query(veri)
    if (veriRol.recordset[0].id = null) {
      await connection.query(`UPDATE users SET `, Ods)
    } */

    console.log(result)
    res.json({ body: result })
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}

const getEquipos = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT e.*, u.nombre, u.apellidos, u.email FROM tmunay_equipo e, users u where u.id = e.user_id`)
    const foundEquiposWithImages = await [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundEquiposWithImages })
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const getEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection()
    const result = await connection.query(`SELECT e.*, u.nombre, u.apellidos, u.email 
    FROM tmunay_equipo e, users u 
    WHERE u.id = e.user_id and e.id=?`, id)
    console.log(result)
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0], file: image } });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, cargo, redSocial, imagen, usuarioModificacion } = req.body;
    delete req.body.user_id
    console.log(req.body)
    if (user_id === undefined)
      res.status(400).json({ message: "Bad Request" })

    const equipo = req.body
    equipo.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection()
    await connection.query(`UPDATE tmunay_equipo SET ? WHERE id=?`, [equipo, id])
    const foundEquipo = await connection.query(`SELECT * FROM tmunay_equipo WHERE id=?`, id);
    if (req.file) {
      const responseUpdateImagen = imagen && updateOneFile({ pathFile: foundEquipo[0].imagen, file: imagen });
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_equipo SET imagen=? WHERE id=?`, [responseUpdateImagen, id]);
      else {
        const path = SaveOneFile({ mainFolder: 'trayectoria', idFolder: foundEquipo[0].id, file: req.file });
        await connection.query(`UPDATE tmunay_equipo SET imagen=? WHERE id=?`, [path, foundEquipo[0].id]);
      }
    }
    emailSender("aivatepaz@gmail.com", "Prueba", "")
    res.json({ body: foundEquipo[0], msg: "Registro actualizado correctamente" })
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}

const deleteEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection()
    const result = await connection.query(`DELETE FROM tmunay_equipo WHERE id=?`, id)
    res.json({ body: result })
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const getUsuarios = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT u.id, u.nombre, u.apellidos, u.email 
    FROM users u 
    WHERE u.id NOT IN (SELECT user_id FROM tmunay_equipo)`)
    let foundEquiposWithImages = await [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    foundEquiposWithImages = await [...result].map((item) => {
      return { ...item, id: encryptar(item.id) };
    });

    res.json({ body: foundEquiposWithImages })
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export const methods = {
  addEquipo,
  getEquipos,
  getEquipo,
  updateEquipo,
  deleteEquipo,
  getUsuarios
}