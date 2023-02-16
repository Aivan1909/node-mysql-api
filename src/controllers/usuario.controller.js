import { json } from "body-parser";
import { getConnection } from "../database/database";

const bcrypt = require("bcrypt");
const { getToken, getTokenData } = require("../bin/jwt");
const _TABLA = "users";
const _TABLA1 = "roless";
const _TABLA2 = "tmunay_rol";

const addRegistro = async (req, res) => {
  try {
    console.log(req.body);
    const dataAdd = req.body;
    const { email, password } = dataAdd;

    const token = await getToken({ email });

    if (password != null) {
      await bcrypt.hash(password, 5, async function (err, hashedPass) {
        if (err)
          res.status(500).json({ message: "Ocurrió un error inesperado." });
        if (hashedPass) {
          dataAdd.password = hashedPass;
          console.log(dataAdd);

          const connection = await getConnection();
          let result = await connection.query(
            `INSERT INTO ${_TABLA} SET ?`,
            dataAdd
          );
          //insertando a la tabla relacional 
          const { insertId } = result;
          const relacionRol = {
            user_id: insertId,
            rol_id: 1,
          };

          result = await connection.query(
            `INSERT INTO ${_TABLA1} SET ?`,
            relacionRol
          );
          //Insertando  a la tabla relacional 

          result = await connection.query(
            `SELECT * FROM ${_TABLA} WHERE id=?`,
            insertId
          );

          result[0].token = token;
          res.json({ body: result[0] });
        }
      });
    }
  } catch (error) {
    const { code } = error;
    if (code === "ER_DUP_ENTRY")
      res.status(422).json({ message: `El correo ${email} ya existe.` });
    else res.status(500).json({ message: "Ocurrió un error inesperado." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await getConnection();
    await connection
      .query(`SELECT * FROM ${_TABLA} WHERE email=?`, email)
      .then((user) => {
        console.log(user[0].password);
        if (user) {
          bcrypt.compare(password, user[0].password, function (err, result) {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Ocurrio un error inesperado" });
            }
            if (result) {
              const token = getToken({ email });
              user[0].token = token;
              return res.json({ message: "Bienvenid@ ", body: user[0] });
            } else {
              console.log(result);
              return res.status(400).json({ message: "Datos incorrectos" });
            }
          });
        } else {
          return res.status(400).json({ message: "Datos incorrectos." });
        }
      })
      .catch((err) => {
        return res.status(400).json({ message: "Datos incorrectos." });
      });
  } catch (error) {
    return res.status(500).json({ message: "Ha ocurrido un error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const connection = await getConnection();
    await connection
      .query(`SELECT * FROM ${_TABLA} WHERE email=?`, email)
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user[0].password, function (err, result) {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Ocurrio un error inesperado" });
            }
            if (result) {
              const token = getToken({ email });
              user[0].token = token;
              return res.json({ message: "Bienvenid@ ", body: user[0] });
            } else {
              console.log(result);
              return res.status(400).json({ message: "Datos incorrectos" });
            }
          });
        } else {
          return res.status(400).json({ message: "Datos incorrectos." });
        }
      })
      .catch((err) => {
        return res.status(400).json({ message: "Datos incorrectos." });
      });
  } catch (error) {
    return res.status(500).json({ message: "Ha ocurrido un error" });
  }
};

const getRegistros = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.query(`SELECT xu.*, xr.roles, xtr.roles_desc 
    FROM ${_TABLA} xu, (SELECT user_id, GROUP_CONCAT(DISTINCT rol_id) as roles FROM ${_TABLA1}) as xr, 
    (select r.user_id, GROUP_CONCAT(DISTINCT tr.nombre) as roles_desc from ${_TABLA} u, ${_TABLA1} r, ${_TABLA2} tr 
    WHERE u.id=r.user_id and r.rol_id=tr.id) as xtr where xu.id=xr.user_id and xr.user_id=xtr.user_id;`)
    res.json({ body: result })
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message)
  }
};

const getRegistro = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      `SELECT * FROM ${_TABLA} WHERE id=?`,
      id
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, enlace, imagen, estado, usuarioModificacion } = req.body;
    if (nombre === undefined) res.status(400).json({ message: "Bad Request" });

    const alianza = {
      nombre,
      enlace,
      imagen,
      estado,
      usuarioModificacion,
      fechaModificacion: new Date().toDateString(),
    };
    const connection = await getConnection();
    const result = await connection.query(`UPDATE ${_TABLA} SET ? WHERE id=?`, [
      alianza,
      id,
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteRegistro = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      `DELETE FROM ${_TABLA} WHERE id=?`,
      id
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const actualizaRoles = async (req, res) => {
  try {
    const { id_user, agregar, eliminar } = req.body
    const connection = await getConnection();
    let result
    if (agregar.length > 0) {
      await agregar.forEach(element => {
        result = connection.query(
          `INSERT INTO ${_TABLA1} SET user_id=? and rol_id=?`,
          [id_user, element]
        );
      });
    }
    if (eliminar.length > 0) {
      await eliminar.forEach(element => {
        result = connection.query(
          `DELETE FROM ${_TABLA1} WHERE user_id=? and rol_id=?`,
          [id_user, element]
        );
      });
    }
    res.json({ body: result })

  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}

export const methods = {
  addRegistro,
  getRegistros,
  getRegistro,
  updateRegistro,
  deleteRegistro,
  login,
  loginAdmin,
  actualizaRoles
};
