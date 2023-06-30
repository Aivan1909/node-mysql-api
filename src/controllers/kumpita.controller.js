import { getConnection } from '../database/database';
import { encryptar, desencryptar } from '../middleware/crypto.mld';


const addkumpitas = async (req, res) => {
  try {
    const kumpita = req.body;
    kumpita.user_id = desencryptar(kumpita.user_id)
    const connection = await getConnection();
    const result = await connection.query(`INSERT INTO tmunay_kumpita SET ?`, kumpita);
    //const path = SaveOneFile({ mainFolder: 'kumpitaia', idFolder: result.insertId, file: req.file });
    //await connection.query(`UPDATE tmunay_kumpita SET imagen=? WHERE id=?`, [path, result.insertId]);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getkumpitas = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_kumpita`);
    // const foundkumpitaiasWithImages = [...result].map((item) => {
    // return { ...item, file: getOneFile(item.imagen) };});
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getkumpita = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM tmunay_kumpita WHERE id=?`, id);
    if (!result.length > 0) return res.status(404).json({ mensaje: "e404" });
    //const image = getOneFile(result[0].imagen);
    res.json({ body: { ...result[0] } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatekumpita = async (req, res) => {
  try {
    const { id } = req.params;
    const { montoDonado, nroCampana, nroDonaciones, user_id } = req.body;
    if (user_id === undefined) return res.status(400).json({ message: 'Bad Request' });
    const kumpita = { montoDonado, nroCampana, nroDonaciones, user_id: desencryptar(user_id) };
    const connection = await getConnection();
    await connection.query(`UPDATE tmunay_kumpita SET ? WHERE id=?`, [kumpita, id]);
    const foundkumpita = await connection.query(`SELECT * FROM tmunay_kumpita WHERE id=?`, id);
    res.json({ body: foundkumpita[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deletekumpita = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(`DELETE FROM tmunay_kumpita WHERE id=?`, id);
    res.json({ body: result });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const methods = {
  addkumpitas,
  getkumpitas,
  getkumpita,
  updatekumpita,
  deletekumpita,
};
