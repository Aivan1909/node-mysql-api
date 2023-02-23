import { getConnection } from '../database/database';

const PUBLIC_URL = process.env.PUBLIC_URL;

const _TABLA = 'tmunay_emprendimientos';
const _TABLA1 = 'users';
const _TABLA2 = 'tmunay_montos';
const _TABLA3 = 'tmunay_mentorias';
const _TABLA4 = 'tmunay_mentores';
const _TABLA5 = 'roless';
const _TABLA6 = 'tmunay_suscripcion';

const getDashboard = async (req, res) => {
  try {
    const connection = await getConnection();
    const cantidades = await connection.query(`
    SELECT COUNT(*) as valor, 'Emprendimientos' as titulo, 'fas fa-industry' as icono FROM ${_TABLA} WHERE estado=1
    UNION
    SELECT COUNT(*) as valor, 'Usuarios' as titulo, 'fas fa-users' as icono FROM ${_TABLA1} WHERE estado=1
    UNION
    SELECT IFNULL(SUM(monto), 0) as valor, 'Monto Financiado' as titulo, 'fas fa-circle-dollar-to-slot' as icono FROM ${_TABLA2}
    UNION
    SELECT COUNT(*) as valor, 'Mentorías' as titulo, 'fas fa-chalkboard' as icono FROM ${_TABLA3} WHERE estado=1
    UNION
    SELECT COUNT(*) as valor, 'Ñañays' as titulo, 'fas fa-chalkboard-user' as icono FROM ${_TABLA4} WHERE estado=1
    UNION
    SELECT COUNT(*) as valor, 'Kumpitas' as titulo, 'fas fa-hand-holding-dollar' as icono FROM ${_TABLA1} a, ${_TABLA5} r WHERE estado=1 and a.id=r.user_id and r.rol_id=3
    UNION
    SELECT COUNT(*) as valor, 'Suscripciones' as titulo, 'fas fa-ticket' as icono FROM ${_TABLA6} WHERE estado=1`);

    const registros = await connection.query(`SELECT DATE_FORMAT(fechaCreacion, '%m/%y'), COUNT(*) FROM tmunay_emprendimientos GROUP BY DATE_FORMAT(fechaCreacion, '%m/%y');`);

    res.json({ body: { cantidades, registros } });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
};

export const methods = {
  getDashboard
};
