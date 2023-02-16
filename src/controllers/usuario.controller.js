import { getConnection } from "../database/database";

const bcrypt = require("bcrypt");
const { getToken, getTokenData } = require("../bin/jwt");
const _TABLA = "users";
const _TABLA1 = "roless";

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
    const result = await connection.query(`SELECT * FROM ${_TABLA}`)
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



export const methods = {
  addRegistro,
  getRegistros,
  getRegistro,
  updateRegistro,
  deleteRegistro,
  login,
  loginAdmin
};
