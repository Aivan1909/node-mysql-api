import { getConnection } from '../database/database';


const addDonaciones = async (req, res) => {
  try {
    const donacion = req.body;
    donacion.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    donacion.estado = 1;
    const connection = await getConnection();
    let result = await connection.query(`INSERT INTO tmunay_donacion SET ?`, donacion);
    //const path = SaveOneFile({ mainFolder: 'donacion', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_donacion SET imagen=? WHERE id=?`, [path, result.insertId]);

  //insertando la relacion Montos
    const { insertId } = result;
    const relacionCampana = {
      campana_id: insertId,
      donacion_id: req.donacion,
    };

    result = await connection.query(
      `INSERT INTO campana_donacion SET ?`,
      relacionCampana
    );
    //Insertando  a la tabla relacional 
    result = await connection.query(
      `SELECT * FROM tmunay_donacion WHERE id=?`,
      insertId
    );

     //insertando la relacion Montos
     const { insertId1 } = result;
     const relacionMonto = {
       monto_id: insertId,
       donacion_id: req.donacion,
     };
 
     result = await connection.query(
       `INSERT INTO donacion_monto SET ?`,
       relacionMonto
     );
     //Insertando  a la tabla relacional 
     result = await connection.query(
       `SELECT * FROM tmunay_donacion WHERE id=?`,
       insertId1
     );

     //Relacion con Usuarios 
     //Relacion con emprendimientos 

    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getDonaciones = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_donacion where estado = '1'`);
   // const founddonacionsWithImages = [...result].map((item) => {
   // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getDonacion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_donacion WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateDonacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { moneda , anonimato, comentario, transferencia, qr, tarjeta , montos_id, usuarioModificacion } = req.body;
        if (montos_id === undefined) return res.status(400).json({ message: 'Bad Request' });
        const donacions = {moneda , anonimato, comentario, transferencia, qr, tarjeta , montos_id, usuarioModificacion};
        donacions.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        await connection.query(`UPDATE tmunay_donacion SET ? WHERE id=?`, [donacions, id]);
        const founddonacions = await connection.query(`SELECT * FROM tmunay_donacion WHERE id=?`, id);
        res.json({ body: founddonacions[0] });
    } catch (error) {
        res.status(500);
        res.json(error.message);
    }
};

const deleteDonacion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_donacion WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addDonaciones,
  getDonaciones,
  getDonacion,
  updateDonacion,
  deleteDonacion,
};
