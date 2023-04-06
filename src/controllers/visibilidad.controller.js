import { getConnection } from '../database/database';


const addvisibilidades = async (req, res) => {
  try {
    const { plataforma, publicidad, emprendimiento_id } = req.body
    const existe = await validaVisibilidad(emprendimiento_id)
    console.log(existe)
    if (!existe) {
      //Obtencion de claves foraneas o externas
      //Plataforma
      let bkPlataforma = plataforma;
      delete req.body.plataforma
      //Publicidad
      let bkPublicidad = publicidad;
      delete req.body.publicidad

      const visibilidad = req.body;
      visibilidad.fecha_inicio = require('moment')().format('YYYY-MM-DD HH:mm:ss');
      visibilidad.fechaCreacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
      visibilidad.estado = 2; // Estado Pendiente

      const connection = await getConnection();
      let result = await connection.query(`INSERT INTO tmunay_visibilidad SET ?`, visibilidad);

      const { insertId } = await result;

      //insertando a la tabla Plataforma
      for (let plataf of bkPlataforma) {
        for (const publi of bkPublicidad) {
          const idExternaPlataforma = {
            visibilidad_id: insertId,
            plataforma_id: plataf,
            publicidad_id: publi
          }

          connection.query(`INSERT INTO plataforma_visibilidad SET ?`, idExternaPlataforma);
        }

      };

      res.json({ body: result });
    } else {
      res.status(428).json({ message: "Solicitud pendiente" });
    }
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
};

const getvisibilidades = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_visibilidad where estado = '1'`);
    // const foundvisibilidadsWithImages = [...result].map((item) => {
    // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const getvisibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_visibilidad WHERE id=? and estado = '1'`, id);
    if (!result.length > 0) return res.status(404);
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const updatevisibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nroPublicacion } = req.body;
    if (nroPublicacion === undefined) return res.status(400).json({ message: 'Bad Request' });
    const visibilidads = { nroPublicacion, usuarioModificacion };
    visibilidads.fechaModificacion = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_visibilidad SET ? WHERE id=?`, [visibilidads, id]);
    const foundvisibilidads = await connection.query(`SELECT * FROM tmunay_visibilidad WHERE id=?`, id);
    res.json({ body: foundvisibilidads[0] });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

const deletevisibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_visibilidad WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
};

// Auxiliares
async function validaVisibilidad(id) {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_visibilidad where estado IN (1, 2) AND emprendimiento_id= ?`, id);

    return result.length > 0
  } catch (error) {
    throw new Error(error);
  }
}

export const methods = {
  addvisibilidades,
  getvisibilidades,
  getvisibilidad,
  updatevisibilidad,
  deletevisibilidad,
};
