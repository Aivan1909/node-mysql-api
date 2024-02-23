import { getConnection } from '../database/database';


const getDashboard = async (req, res) => {
  try {
    const connection = await getConnection();

    // Obtener la cantidad de emprendimientos, usuarios, monto financiado, mentorias, ñañays, kumpitas y suscripciones
    const cantidades = await connection.query(`
    SELECT COUNT(*) as valor, 'Emprendimientos' as titulo, 'fas fa-industry' as icono FROM tmunay_emprendimientos WHERE estado=1
    UNION
    SELECT COUNT(*) as valor, 'Usuarios' as titulo, 'fas fa-users' as icono FROM users WHERE estado=1
    UNION
    (SELECT 10 as valor, 'Monto Financiado' as titulo, 'fas fa-circle-dollar-to-slot' as icono FROM roless LIMIT 1)
    UNION
    SELECT COUNT(*) as valor, 'Mentorías' as titulo, 'fas fa-chalkboard' as icono FROM tmunay_mentorias WHERE estado=1
    UNION
    SELECT COUNT(*) as valor, 'Ñañays' as titulo, 'fas fa-chalkboard-user' as icono FROM tmunay_mentores WHERE estado=1
    UNION
    SELECT COUNT(*) as valor, 'Kumpitas' as titulo, 'fas fa-hand-holding-dollar' as icono FROM users a, roless r WHERE estado=1 and a.id=r.user_id and r.rol_id=3
    UNION
    SELECT COUNT(*) as valor, 'Suscripciones' as titulo, 'fas fa-ticket' as icono FROM tmunay_suscripcion WHERE estado=1`);

    // Obtener registros por fecha
    const registros = await connection.query(`SELECT fechas.fecha, IFNULL(em.conteo, 0) cantEmprendimiento,
    IFNULL(me.conteo, 0) cantMentores, IFNULL(ku.conteo, 0) cantKumpitas
    FROM
    (SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH), '%m/%y') fecha UNION ALL
    SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 4 MONTH), '%m/%y') fecha UNION ALL
    SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH), '%m/%y') fecha UNION ALL
    SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH), '%m/%y') fecha UNION ALL
    SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), '%m/%y') fecha UNION ALL
    SELECT DISTINCT DATE_FORMAT(CURRENT_DATE, '%m/%y') fecha) fechas
    LEFT JOIN(
        SELECT DATE_FORMAT(fechaCreacion, '%m/%y') fecha, COUNT(*) conteo
        FROM tmunay_emprendimientos
        GROUP BY DATE_FORMAT(fechaCreacion, '%m/%y')
    ) em
    ON fechas.fecha = em.fecha
    LEFT JOIN(
        SELECT DATE_FORMAT(fechaCreacion, '%m/%y') fecha, COUNT(*) conteo
        FROM tmunay_mentores
        GROUP BY DATE_FORMAT(fechaCreacion, '%m/%y')
    ) me
    ON fechas.fecha = me.fecha
    LEFT JOIN(
        SELECT DATE_FORMAT(fechaCreacion, '%m/%y') fecha, COUNT(*) conteo
        FROM tmunay_kumpita
        GROUP BY DATE_FORMAT(fechaCreacion, '%m/%y')
    ) ku
    ON fechas.fecha = ku.fecha;`);
    let wkRegistros = []
    for (const iterator of registros) {
      wkRegistros = [...wkRegistros, Object.values(iterator)]
    }

    // Obtener suscripciones por fecha
    let wkCabeceraSuscripciones = ['Mes']
    let wkSuscripciones = []
    const planes = await connection.query(`SELECT * FROM tmunay_planes`);
    let p = 0
    for (const plan of planes) {
      wkCabeceraSuscripciones.push(plan.nombre)

      const suscripciones = await connection.query(`SELECT fechas.fecha, IFNULL(sus.conteo, 0) cantSuscripciones
      FROM (SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 4 MONTH), '%m/%y') fecha UNION ALL
        SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH), '%m/%y') fecha UNION ALL
        SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH), '%m/%y') fecha UNION ALL
        SELECT DISTINCT DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), '%m/%y') fecha UNION ALL
        SELECT DISTINCT DATE_FORMAT(CURRENT_DATE, '%m/%y') fecha) fechas
      LEFT JOIN
      (SELECT DATE_FORMAT(su.fechaCreacion, '%m/%y') fecha, COUNT(*) conteo 
        FROM tmunay_suscripcion su, tmunay_planes pl where pl.id=su.plan_id and pl.id= ?) sus
      ON fechas.fecha=sus.fecha`, plan.id);

      let i = 0

      for (const iterator of suscripciones) {
        if (p == 0)
          wkSuscripciones.push(Object.values(iterator))
        else
          wkSuscripciones[i].push(iterator.cantSuscripciones)

        i++
      }
      p++
    }
    wkSuscripciones.unshift(wkCabeceraSuscripciones)

    const departamentos = await connection.query(`
    SELECT de.descripcionChart, IFNULL(cantDepartamento, 0) cantDepartamento
    FROM tmunay_departamentos de
    LEFT JOIN
    (SELECT departamento_id, COUNT(*) cantDepartamento
       FROM tmunay_emprendimientos
      GROUP BY departamento_id) em
    ON em.departamento_id=de.id
    ORDER BY cantDepartamento DESC`)
    const wkDepartamentos = departamentos.map(item => Object.values(item))

    res.json({ body: { cantidades, registros: wkRegistros, suscripciones: wkSuscripciones, departamentos: wkDepartamentos } });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

export const methods = {
  getDashboard
};
