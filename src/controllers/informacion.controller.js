import { getConnection } from "../database/database";
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';
import { encryptar, desencryptar } from '../middleware/crypto.mld';

const addRegistro = async (req, res) => {
  try {
    const dataAdd = req.body;

    const connection = await getConnection();
    let result = await connection.query(
      `INSERT INTO tmunay_informacion SET ?`,
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
    const result = await connection.query(`SELECT tmin.*
    FROM tmunay_informacion tmin`)

    const infoesImages = [...result].map((item) => {
      return { ...item, fileImagenQR: getOneFile(item.imagenQR) };
    });

    res.json({ body: infoesImages[0] })
  } catch (error) {
    res.status(500).json(error.message)
  }
};

const getRegistro = async (req, res) => {
  try {
    const { id } = req.body;

    const connection = await getConnection()
    const result = await connection.query(`SELECT tmin.*
    FROM tmunay_informacion tmin
    WHERE tmin = ?`, id)

    const infoesImages = [...result].map((item) => {
      return { ...item, fileImagenQR: getOneFile(item.imagenQR) };
    });

    res.json({ body: infoesImages[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const infoNuevo = req.body;

    const idInfo = infoNuevo.id;
    delete infoNuevo.id;
    infoNuevo.usuarioModificacion = desencryptar(infoNuevo.usuarioModificacion);


    const connection = await getConnection();
    const result = await connection.query(`UPDATE tmunay_informacion SET ? WHERE id=?`, [
      infoNuevo,
      idInfo,
    ]);

    if (req.file) {
      const foundRegistro = await connection.query(`SELECT * FROM tmunay_informacion WHERE id=?`, id);
      const { imagenQR } = infoNuevo;
      console.log(infoNuevo, imagenQR)
      const responseUpdateImagen = imagenQR && updateOneFile({ pathFile: foundRegistro[0].imagenQR, file: imagenQR, targetSize: 400 });
      if (responseUpdateImagen)
        await connection.query(`UPDATE tmunay_informacion SET imagenQR=? WHERE id=?`, [responseUpdateImagen, id]);
      else {
        const path = await SaveOneFile({ mainFolder: 'informacion', idFolder: foundRegistro[0].id, file: req.file, targetSize: 400 });
        await connection.query(`UPDATE tmunay_informacion SET imagenQR=? WHERE id=?`, [path, foundRegistro[0].id]);
      }
    }


    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    const result = await connection.query(
      `DELETE FROM tmunay_informacion WHERE id=?`,
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
