import { getConnection } from "../database/database";
import { encryptar, desencryptar } from '../middleware/crypto.mld';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';


const bcrypt = require("bcrypt");
const { getToken, getTokenData } = require("../bin/jwt");

const addRegistro = async (req, res) => {
  try {
    const dataAdd = req.body;
    const { email, password } = dataAdd;

    if (password != null) {
      const hashedPass = await bcrypt.hash(password, 5)

      dataAdd.password = hashedPass;
      dataAdd.estado = 2

      dataAdd.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
      dataAdd.usuarioCreacion = dataAdd.usuarioCreacion ? dataAdd.usuarioCreacion : "";

      asignarNick(dataAdd.nombre, dataAdd.apellidos)

      const connection = await getConnection();
      let result = await connection.query(
        `INSERT INTO users SET ?`,
        dataAdd
      );
      //insertando a la tabla relacional 
      const { insertId } = result;
      const relacionRol = {
        user_id: insertId,
        rol_id: 4,
      };

      result = await connection.query(`INSERT INTO roless SET ?`, relacionRol);
      //Insertando  a la tabla relacional 

      result = await connection.query(
        `SELECT * FROM users WHERE id=?`,
        insertId
      );

      const token = await getToken({ email });
      result[0].token = token;
      res.json({ body: result[0] });
    }
  } catch (error) {
    const { code } = error;

    if (code == "ER_DUP_ENTRY")
      res.status(409).json({ message: `e422` });
    else res.status(500).json({ message: "Ocurrió un error inesperado." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await getConnection();
    await connection
      .query(`SELECT * FROM users WHERE estado not in (0, 3) and google_login = 0 and email=?`, email)
      .then((user) => {
        if (user) {

          const { id } = user[0]
          let token;
          bcrypt.compare(password, user[0].password, function (err, result) {
            if (err) {
              return res
                .status(500)
                .json({ message: "Ocurrio un error inesperado" });
            }
            if (result) {
              token = getToken({ email });
              user[0].token = token;
              user[0].id = encryptar(id);

              return res.json({ message: "Bienvenid@ ", body: user[0] });
            } else {
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

    const connection = await getConnection();
    await connection
      .query(`SELECT us.* 
      FROM users us, roless r, tmunay_rol mr
      WHERE us.estado not in (0, 3) and mr.id=r.rol_id AND us.id=r.user_id AND mr.nombre='admin' AND us.google_login = 0 AND us.email=?`, email)
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user[0].password, function (err, result) {
            if (err) {
              return res
                .status(500)
                .json({ message: "Ocurrio un error inesperado" });
            }
            if (result) {
              const token = getToken({ email });
              user[0].token = token;
              return res.json({ message: "Bienvenid@ ", body: user[0] });
            } else {
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
    FROM users xu, (SELECT user_id, GROUP_CONCAT(DISTINCT rol_id) as roles FROM roless group by user_id) as xr, 
    (select r.user_id, GROUP_CONCAT(DISTINCT tr.nombre) as roles_desc from users u, roless r, tmunay_rol tr 
    WHERE u.id=r.user_id and r.rol_id=tr.id group by r.user_id) as xtr where xu.id=xr.user_id and xr.user_id=xtr.user_id;`)
    res.json({ body: result })
  } catch (error) {
    res.status(500).json(error.message)
  }
};

const getRegistro = async (req, res) => {
  try {
    const { id } = req.body;
    const idd = desencryptar(id)

    const connection = await getConnection();
    const result = await connection.query(
      `SELECT nombre, apellidos, email, sexo, fechaNacimiento, pais, avatar, codigoTel, telefono, estado, nick, tmpu.*
      FROM users us 
      LEFT JOIN tmunay_perfil_user tmpu ON us.id = tmpu.user_id
      WHERE us.id = ?`,
      idd
    );
    result[0].idPerfil = result[0].id;
    result[0].id = encryptar(result[0].user_id);

    const emprendimientos = await connection.query(`SELECT id, emprendimiento, codigo, estado 
    FROM tmunay_emprendimientos 
    WHERE user_id=?`, idd)
    result[0].emprendimientos = emprendimientos;

    res.json({ body: result[0] });
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
    const result = await connection.query(`UPDATE users SET ? WHERE id=?`, [
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
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      `DELETE FROM users WHERE id=?`,
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
          `INSERT INTO roless SET user_id=?, rol_id=?`,
          [id_user, element]
        );
      });
    }
    if (eliminar.length > 0) {
      await eliminar.forEach(element => {
        result = connection.query(
          `DELETE FROM roless WHERE user_id=? and rol_id=?`,
          [id_user, element]
        );
      });
    }
    res.json({ body: result })

  } catch (error) {
    res.status(500).json(error.message);
  }
}

const cambiarEstado = async (req, res) => {
  try {
    const { id_user } = req.params
    const { estado } = req.body
    const connection = await getConnection();

    const result = connection.query(
      `UPDATE users SET estado=? where id=?`,
      [estado, id_user]
    );

    res.json({ body: result })

  } catch (error) {
    res.status(500).json(error.message);
  }
}

const getRegistroNick = async (req, res) => {
  try {
    const { nick } = req.params;

    const connection = await getConnection();
    const result = await connection.query(
      `SELECT u.id, u.nombre, u.apellidos, u.email, u.sexo, u.fechaNacimiento, u.pais, u.avatar, u.codigoTel, u.telefono, u.fechaCreacion, u.nick
      , tmpu.sobreMi, IFNULL(tmpu.likes, 0) likes, tmpu.calle, tmpu.ciudad, tmpu.codigoPostal, tmpu.perfilPublico, tmpu.nombrePublico, tmpu.titulo, tmpu.emailPublico
      FROM users u
      LEFT JOIN tmunay_perfil_user tmpu
      ON u.id = tmpu.user_id
      WHERE u.nick=?`,
      nick
    );

    const idd = result[0].id
    const emprendimientos = await connection.query(`SELECT id, emprendimiento, codigo 
    FROM tmunay_emprendimientos 
    WHERE estado=1 AND user_id=?`, idd)
    result[0].emprendimientos = emprendimientos;
    result[0].id = encryptar(result[0].id)


    const resultado = [...result].map((item) => {
      return { ...item, fileAvatar: getOneFile(item.avatar) };
    });

    res.json({ body: resultado[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


/* Metodos Google */
const loginGoogle = async (req, res) => {
  try {
    const { email } = req.body;

    const connection = await getConnection();
    await connection
      .query(`SELECT * FROM users WHERE google_login = 1 AND email=?`, email)
      .then(async (user) => {
        if (user.length > 0) {

          const { id } = user[0]
          const token = getToken({ email });
          user[0].token = token;
          user[0].id = encryptar(id);

          return res.json({ message: "Bienvenid@ ", body: user[0] });
        } else {
          const respuesta = await addRegistroGoogle(req)
          return res.json({ message: "Bienvenid@ ", body: respuesta });
        }
      })
      .catch((err) => {
        return res.status(400).json({ message: "Datos incorrectos." });
      });
  } catch (error) {
    return res.status(500).json({ message: "Ha ocurrido un error" });
  }
}

const loginAdminGoogle = async (req, res) => {
  try {
    const { email } = req.body;

    const connection = await getConnection();
    await connection
      .query(`SELECT us.* 
      FROM users us, roless r, tmunay_rol mr
      WHERE mr.id=r.rol_id AND us.id=r.user_id AND mr.nombre='admin' AND us.google_login = 1 AND us.email=?`, email)
      .then(async (user) => {
        if (user.length > 0) {

          const { id } = user[0]
          const token = getToken({ email });
          user[0].token = token;
          user[0].id = encryptar(id);

          return res.json({ message: "Bienvenid@ ", body: user[0] });
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
}

const addRegistroGoogle = async (req) => {
  try {
    const dataAdd = req.body;
    const { email } = dataAdd;
    const token = await getToken({ email });
    dataAdd.estado = 2;

    const connection = await getConnection();
    let result = await connection.query(
      `INSERT INTO users SET ?`,
      dataAdd
    );
    //insertando a la tabla relacional 
    const { insertId } = result;
    const relacionRol = {
      user_id: insertId,
      rol_id: 4,
    };

    result = await connection.query(`INSERT INTO roless SET ?`, relacionRol);
    //Insertando  a la tabla relacional 

    result = await connection.query(
      `SELECT * FROM users WHERE id=?`,
      insertId
    );

    result[0].token = token;
    return result[0];
  } catch (error) {
    throw new Error(error)
  }
};

/* Funciones */
function crearNick(nombre) {
  // Replace Spanish characters with normal letters
  const replacedString = nombre
    .replace(/[áä]/g, 'a')
    .replace(/[éë]/g, 'e')
    .replace(/[íï]/g, 'i')
    .replace(/[óö]/g, 'o')
    .replace(/[úü]/g, 'u')
    .replace(/[ñ]/g, 'n');

  // Remove blank spaces
  const withoutSpaces = replacedString.replace(/\s/g, '_');

  // Convert to lowercase
  const lowercaseString = withoutSpaces.toLowerCase();

  // Delete special characters using regular expression
  const elLink = lowercaseString.replace(/[^a-z0-9]/g, '');

  return elLink
}
async function asignarNick(nombre, apellidos) {
  let nickExists = false;
  let newNick = await crearNick(nombre);
  let counter = 0

  do {
    const connection = await getConnection();
    let result = await connection.query(
      `select 1 from users where nick=?`,
      newNick
    );

    if (result) {
      nickExists = true;
      counter += counter
      newNick += newNick + counter.toString()
    } else {
      nickExists = false;
    }

  } while (!nickExists);

  return await newNick;
}

export const methods = {
  addRegistro,
  getRegistros,
  getRegistro,
  updateRegistro,
  deleteRegistro,
  login,
  loginAdmin,
  actualizaRoles,
  cambiarEstado,
  getRegistroNick,
  /* Google */
  loginGoogle,
  loginAdminGoogle
};
