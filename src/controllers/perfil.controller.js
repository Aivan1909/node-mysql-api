import { getConnection } from "../database/database";
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const addRegistro = async (req, res) => {
  try {
    const dataAdd = req.body;

    const connection = await getConnection();
    let result = await connection.query(
      `INSERT INTO tmunay_perfil_user SET ?`,
      dataAdd
    );

    res.json({ body: result[0] });
  } catch (error) {
    const { code } = error;

    if (code == "ER_DUP_ENTRY")
      res.status(409).json({ message: `e422` });
    else res.status(500).json({ message: "Ocurrió un error inesperado." });
  }
};

const getRegistros = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT tmpu.*, usr.nombre, usr.apellidos, usr.avatar, usr.nick,
    FROM tmunay_perfil_user tmpu, users usr
    WHERE usr.id = tmpu.user_id`)

    const perfilesImages = [...result].map((item) => {
      return { ...item, avatar: getOneFile(item.avatar) };
    });

    res.json({ body: perfilesImages })
  } catch (error) {
    res.status(500).json(error.message)
  }
};

const getRegistro = async (req, res) => {
  try {
    const { id } = req.body;

    const connection = await getConnection()
    const result = await connection.query(`SELECT tmpu.*, usr.nombre, usr.apellidos, usr.avatar, usr.nick,
    FROM tmunay_perfil_user tmpu, users usr
    WHERE usr.id = tmpu.user_id AND tmpu = ?`, id)

    const perfilesImages = [...result].map((item) => {
      return { ...item, avatar: getOneFile(item.avatar) };
    });

    res.json({ body: perfilesImages[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const perfilNuevo = req.body;
    const idPerfil = perfilNuevo.id
    delete perfilNuevo.id

    const connection = await getConnection();

    if (perfilNuevo.usuario) {
      const usuarioNuevo = perfilNuevo.usuario
      delete perfilNuevo.usuario
      const idUser = desencryptar(usuarioNuevo.id)
      delete usuarioNuevo.id

      usuarioNuevo.usuarioModificacion = desencryptar(usuarioNuevo.usuarioModificacion);
      usuarioNuevo.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');

      const resultUser = await connection.query(`UPDATE users SET ? WHERE id=?`, [
        usuarioNuevo,
        idUser,
      ]);
    }

    const result = await connection.query(`UPDATE tmunay_perfil_user SET ? WHERE id=?`, [
      perfilNuevo,
      idPerfil,
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    const result = await connection.query(
      `DELETE FROM tmunay_perfil_user WHERE id=?`,
      id
    );

    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addRegistro,
  getRegistro,
  getRegistros,
  updateRegistro,
  deleteRegistro,
};
