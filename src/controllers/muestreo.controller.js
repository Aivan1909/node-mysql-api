import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL

const _TABLA9 = "tmunay_montos"
const _TABLA12 = "tmunay_mentores";
const _TABLA13 = "tmunay_kumpita";
const _TABLA16 = "tmunay_sectores";
const _TABLA17 = "tmunay_fases";
const _TABLA18 = "tmunay_figuras";
const _TABLA19 = "tmunay_ods";
const _TABLA20 = "tmunay_areas";
const _TABLA21 = "tmunay_especialidad";
const _TABLA22 = "tmunay_criterios";
const _TABLA23 = "emprendimiento_modal";
const _TABLA24 = "criterios_emprendimientos";
const _TABLA25 = "emprendimientos_ods";
const _TABLA26 = "tmunay_comentarios";
const _TABLA27 = "area_mentor";
const _TABLA28 = "especialidad_mentor";

// Muestreo de pagina de Index [Home, Inicio]
const getInicio = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql2 = `SELECT concat(nombre,' ', apellidos )  as  nombre ,testimonio,imagen FROM tmunay_testimonios`
    const testimonio = await connection.query(sql2)

    //Obteniendo 
    const foundTestimoniosWithImages = [...testimonio].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });


    let sql3 = `SELECT 'registrados' as id ,count(*) as cantidad FROM tmunay_emprendimientos`
    const emprendimiento = await connection.query(sql3)

    let sql4 = `SELECT 'horas' as id, count(*) as cantidad FROM tmunay_mentorias`
    const mentoria = await connection.query(sql4)

    let sql5 = `SELECT 'monto' as id, ifnull(sum(monto), 0) as cantidad, 'USD' as medida FROM ${_TABLA9}`
    const campana = await connection.query(sql5)

    const topEmpre = await obtenerEmprendimientos()

    const result = { 'testimonio': foundTestimoniosWithImages, 'impacto': [emprendimiento[0], mentoria[0], campana[0]], emprendimientos: topEmpre }

    res.json({ body: result })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo de pagina Sobre Munay [Sobre Munay]
const getSobreMunay = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT  CONCAT(A.nombre,' ',A.apellidos) AS nombre, B.cargo, B.imagen, B.redSocial 
    FROM users A, tmunay_equipo B 
    where A.id = B.user_id`
    const equipo = await connection.query(sql1)
    const foundEquiposWithImages = await [...equipo].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    let sql2 = `SELECT concat(nombres,' ',apellidos) AS nombre, cargo, redSocial,imagen FROM tmunay_asesor`
    const asesor = await connection.query(sql2)

    let sql3 = `SELECT nombre,imagen FROM tmunay_trayectoria`
    const trayectoria = await connection.query(sql3)

    let sql4 = `SELECT nombre, imagen, enlace FROM tmunay_colaboradores`
    const colaborador = await connection.query(sql4)
    const foundColaboradoresWithImages = await [...colaborador].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    let sql5 = `SELECT nombre, imagen FROM tmunay_alianzas`
    const alianza = await connection.query(sql5)
    const foundAlianzasWithImages = await [...alianza].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    //const result = {}[equipo,asesor,trayectoria,colaborador,alianza]
    const result = { 'equipo': foundEquiposWithImages, 'asesor': asesor, 'trayectoria': trayectoria, 'colaborador': foundColaboradoresWithImages, 'alianza': foundAlianzasWithImages }

    res.json({ body: result })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Mentores [Solicita tu mentoria]
const getNuestrosMentores = async (req, res) => {
  try {
    const connection = await getConnection();
    // Areas
    let sql1 = `select * from tmunay_areas where estado =1 and tipo ='E'`;
    let reAreas = await connection.query(sql1);

    for (const area of reAreas) {
      // Obtener Especialidades
      let sql2 = `SELECT nombre FROM tmunay_especialidad WHERE estado=1 AND areas_id= ?`
      let reEspecialidades = await connection.query(sql2, area.id);

      area.especialidades = reEspecialidades.map((item) => item.nombre)

      // Obtener mentores
      sql2 = `SELECT u.avatar
      FROM tmunay_especialidad e, dicta_mentoria dm, tmunay_mentores me, users u
      WHERE dm.especialidad_id=e.id AND dm.mentor_id=me.id AND me.user_id=u.id AND e.estado=1 AND u.avatar IS NOT NULL AND e.areas_id= ?`
      let reMentores = await connection.query(sql2, area.id);

      area.mentores = await [...reMentores].map((item) => getOneFile(item.avatar));
    }

    await res.json({ body: reAreas });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo User - Admin 1 
const getMuestreoUser = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, estado, email as Correo, apellidos, nombre, fechaCreacion  FROM users `
    const usuario = await connection.query(sql1)
    const result = usuario
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Emprendimiento - Admin 2 
const getMuestreoEmprendimiento = async (req, res) => {
  try {

    const result = await obtenerEmprendimientos()
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Mentores - Admin 3 
const getMuestreoMentores = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT A.estado, B.nombre,B.apellidos,B.fechaCreacion FROM ${_TABLA12} A, users B WHERE A.user_id = B.id`
    const mentores = await connection.query(sql1)
    const result = mentores
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Kumpitas - Admin 4 
const getMuestreoKumpita = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT A.estado, B.nombre,B.apellidos,B.fechaCreacion FROM ${_TABLA13} A, users B WHERE A.user_id = B.id`
    const kumpita = await connection.query(sql1)
    const result = kumpita
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo testimonio  - Admin 7  
const getMuestreoTestimonio = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT concat(nombre," ",apellidos ) as Nombre, fechaCreacion, id  FROM tmunay_testimonios  where estado = '1' `
    const testimonio = await connection.query(sql1)
    const result = testimonio
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muesttreo Categorias - Admin 8 (Preguntar)

// Muestreo Ods - Admin 9
const getMuestreoOds = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, nombre, estado , fechaCreacion  FROM ${_TABLA19}  where estado = '1' `
    const ods = await connection.query(sql1)
    const result = ods
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Areas Especializacion - Admin 9
// Area Mentoria 
const getMuestreoArea = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, nombre, estado , fechaCreacion  FROM ${_TABLA20}  where estado = '1' `
    const Area = await connection.query(sql1)
    const result = Area
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}
// Especialidades de la mentoria 
const getMuestreoEspecializacion = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, nombre, estado , fechaCreacion  FROM ${_TABLA21}  where estado = '1' `
    const Especialidades = await connection.query(sql1)
    const result = Especialidades
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo sector  - Admin 10  
const getMuestreoSector = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, estado, descripcion, fechaCreacion  FROM ${_TABLA16}  where estado = '1' `
    const sector = await connection.query(sql1)
    const result = sector
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Fases  - Admin 11 
const getMuestreoFases = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, estado, descripcion, fechaCreacion  FROM ${_TABLA17}  where estado = '1' `
    const fases = await connection.query(sql1)
    const result = fases
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Figura Legal  - Admin 12
const getMuestreoFiguraLegal = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, estado, descripcion, fechaCreacion  FROM ${_TABLA18}   `
    const figura = await connection.query(sql1)
    const result = figura
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}
//Muestreo Criterio Enfoque - Admin 13
const getMuestreoCriterios = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT id, descripcion, estado , fechaCreacion  FROM ${_TABLA22}  where estado = '1' `
    const Criterio = await connection.query(sql1)
    const result = Criterio
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Equipo - Admin 14
const getMuestreoEquipo = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT  A.id, B.apellidos, B.nombre, B.email , A.fechaCreacion FROM tmunay_equipo A, users B  WHERE A.user_id = B.id`
    const equipo = await connection.query(sql1)
    const result = equipo
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Asesores - Admin 15
const getMuestreoAsesor = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT  id, estado, nombres, apellidos, cargo, fechaCreacion FROM tmunay_asesor WHERE estado = '1'`
    const asesor = await connection.query(sql1)
    const result = asesor
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Trayectoria - Admin 16
const getMuestreoTrayectoria = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT  id, estado, nombre, fechaCreacion FROM tmunay_trayectoria WHERE estado = '1'`
    const trayectoria = await connection.query(sql1)
    const result = trayectoria
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Colaboradores - Admin 17
const getMuestreoColaboradores = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT  id, estado, nombre, fechaCreacion FROM tmunay_colaboradores WHERE estado = '1'`
    const colaborador = await connection.query(sql1)
    const result = colaborador
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Alianzas - Admin 18
const getMuestreoAlianzas = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = ` SELECT id, estado, nombre, fechaCreacion FROM tmunay_alianzas WHERE estado = '1'`
    const alianza = await connection.query(sql1)
    const result = alianza
    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//let sql2 = `SELECT nombre,testimonio,imagen FROM tmunay_testimonios`
//const testimonio = await connection.query(sql2)

//Obteniendo 
//const foundTestimoniosWithImages = [...testimonio].map((item) => {
//  return { ...item, file: getOneFile(item.imagen) };
//});

//Muestreo de modal  emprendimientos 
const getModalEmprendimientos = async (req, res) => {
  try {
    //const { id } = req.params;
    const enlace = "https://www.soymunay.org/emprendimientos/";
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM ${_TABLA23} where estado = '1'`);
    const foundEmprendimientosWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.logo) };
    });
    //const enlace1 = [...result].map((item) => {
    //  return { ...item, string: item.link };
    //});
    //enlace1.forEach(valor => console.log("enlace500", valor[0].link))
    //console.log("enlace",enlace1[0].link);  
    res.json({ body: foundEmprendimientosWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo Detalles Emprendimiento completo [BOTON -  VERMAS]
const getDetalleEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const enlace = "https://www.soymunay.org/emprendimientos/";
    const connection = await getConnection();

    //Emprendimiento 
    let sql1 = `SELECT A.id, A.logo, A.emprendimiento, A.nombreRepr, A.cargoRepresentante, 
                A.emailRepresentante, A.problema, A.explicacionSolucion, A.mision, A.motivacion, A.competidores, A.clientes, A.propuestaValor,
                case  when A.coFundadores >= 1  and A.fundadores >= A.coFundadores then  (100 - ((100/A.fundadores)*(A.fundadores-A.coFundadores))) else 0 end  as porcentajeCofundadores,
                A.mujeresEmpleadas    
                FROM tmunay_emprendimientos A  WHERE A.id = ?`;
    let result1 = await connection.query(sql1, id);
    const foundEmprendimientosWithImages = [...result1].map((item) => {
      return { ...item, file: getOneFile(item.logo) };
    });

    //Criterio Enfoque - Emprendimiento  

    let sql2 = `SELECT A.id, A.imagen, A.imagenEN, B.emprendimiento_id
                FROM ${_TABLA22} A
                INNER JOIN ${_TABLA24} B ON A.id = B.criterios_id
                WHERE B.emprendimiento_id = ?`;

    let result2 = await connection.query(sql2, id);
    const foundCriterioWithImages = [...result2].map((item) => {
      return { ...item, fileImagen: getOneFile(item.imagen), fileImagenEN: getOneFile(item.imagenEN) };
    });

    //Ods - Emprendimientos 
    let sql3 = `SELECT A.id, A.imagen, A.imagenEN, B.emprendimiento_id
                 FROM ${_TABLA19} A
                 INNER JOIN ${_TABLA25} B ON A.id = B.ods_id
                 WHERE B.emprendimiento_id = ?`;
    let result3 = await connection.query(sql3, id);
    const foundOdsWithImages = [...result3].map((item) => {
      return { ...item, fileImagen: getOneFile(item.imagen), fileImagenEN: getOneFile(item.imagenEN) };
    });

    //Comentario - Emprendimiento 
    let sql4 = `SELECT A.id, A.comentario, B.nombre 
                FROM  ${_TABLA26} A 
                INNER JOIN users B ON A.user_id = B.id
                WHERE A.emprendimientos_id = ?`;
    let result4 = await connection.query(sql4, id);
    const comentario = result4;

    const resultF = { 'emprendimiento': foundEmprendimientosWithImages, 'criterio': foundCriterioWithImages, 'ods': foundOdsWithImages, 'comentario': comentario };
    res.json({ body: resultF });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo Mentores [Conoce a nuestros mentores]
const getConoceMentores = async (req, res) => {
  try {
    const connection = await getConnection();


    let sql1 = `SELECT B.id, concat(B.nombre,' ',B.apellidos) as nombre , group_concat(D.nombre) as especialidad, B.avatar
                FROM ${_TABLA12} A
                INNER JOIN users B ON A.user_id = B.id 
                INNER JOIN ${_TABLA28} C ON A.id = C.mentor_id 
                INNER JOIN ${_TABLA21}  D ON D.id = C.especialidad_id
                GROUP  BY B.id 
                ORDER BY especialidad DESC`
    let result = await connection.query(sql1);
    const foundMentoresWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.avatar) };
    });

    res.json({ body: foundMentoresWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Finanzas] 
const getMentoriaFinazas = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '1'`
    let result = await connection.query(sql1);
    const foundFinanzasWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });
    res.json({ body: foundFinanzasWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Impacto] 
const getMentoriaImpacto = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '2'`
    let result = await connection.query(sql1);
    const foundImpactoWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundImpactoWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Impacto] 
const getMentoriaLegal = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '3'`
    let result = await connection.query(sql1);
    const foundLegalWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundLegalWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Marketing] 
const getMentoriaMarketing = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '4'`
    let result = await connection.query(sql1);
    const foundMarketingWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundMarketingWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Gestion Empresarial] 
const getMentoriaGestion = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '5'`
    let result = await connection.query(sql1);
    const foundGestionWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundGestionWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Postulaciones] 
const getMentoriaPostulaciones = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '6'`
    let result = await connection.query(sql1);
    const foundPostulacionesWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundPostulacionesWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Sistemas] 
const getMentoriaSistemas = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '7'`
    let result = await connection.query(sql1);
    const foundSistemasWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundSistemasWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo para los botones de Mentorias Especializadas [Mentoria Sistemas] 
const getMentoriaEmpoderamiento = async (req, res) => {
  try {
    const connection = await getConnection();

    let sql1 = `select A.id,  A.nombre AS nombreArea, B.nombre AS nombreEspecialidad, B.imagen 
    from  ${_TABLA20} A , ${_TABLA21} B 
    WHERE A.id = B.areas_id AND A.id = '8'`
    let result = await connection.query(sql1);
    const foundEmpoderamientoWithImages = [...result].map((item) => {
      return { ...item, file: getOneFile(item.imagen) };
    });

    res.json({ body: foundEmpoderamientoWithImages });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

/* Funciones auxiliares */
// Obtener datos de emprendimiento para card
async function obtenerEmprendimientos() {
  const connection = await getConnection()

  let sql6 = `SELECT emprendimiento, link, e.descripcion, logo, portada, fotoFundadores, fotoEquipo, de.id departamentoId, de.descripcion departamentoDescripcion, emse.sectores, emse.sectoresCodigo, CASE WHEN sus.id IS NULL THEN 0 ELSE 1 END suscripcion
  FROM tmunay_departamentos de, tmunay_emprendimientos e
  LEFT JOIN (SELECT es.emprendimiento_id, GROUP_CONCAT(s.descripcion SEPARATOR ', ') sectores, GROUP_CONCAT(s.id SEPARATOR ', ') sectoresCodigo
             FROM tmunay_sectores s, emprendimientos_sector es 
             WHERE es.sectores_id=s.id
             GROUP BY es.emprendimiento_id) emse
  ON emse.emprendimiento_id=e.id
  LEFT JOIN tmunay_suscripcion sus
  ON sus.emprendimiento_id=e.id
  where de.id=e.departamento_id and e.estado=1 
  ORDER BY e.fechaCreacion DESC 
  LIMIT 12`
  const topEmpre = await connection.query(sql6)


  for (const emp of topEmpre) {
    emp.imagenes = []
    if (emp.logo != null) {
      const imgLogo = getOneFile(emp.logo)
      emp.imagenes.push(imgLogo)
      emp.logo = imgLogo
    }
    if (emp.portada != null) {
      const imgPortada = getOneFile(emp.portada)
      emp.imagenes.push(imgPortada)
    }
    if (emp.fotoFundadores != null) {
      const imgFotoFundadores = getOneFile(emp.fotoFundadores)
      emp.imagenes.push(imgFotoFundadores)
    }
    if (emp.fotoEquipo != null) {
      const imgFotoEquipo = getOneFile(emp.fotoEquipo)
      emp.imagenes.push(imgFotoEquipo)
    }
  }

  return topEmpre;
}


export const methods = {
  getSobreMunay,
  getInicio,
  getMuestreoUser,
  getMuestreoEmprendimiento,
  getMuestreoMentores,
  getMuestreoKumpita,
  getMuestreoTestimonio,
  getMuestreoSector,
  getMuestreoFases,
  getMuestreoFiguraLegal,
  getMuestreoOds,
  getMuestreoArea,
  getMuestreoEspecializacion,
  getMuestreoCriterios,
  getMuestreoEquipo,
  getMuestreoAsesor,
  getMuestreoTrayectoria,
  getMuestreoColaboradores,
  getMuestreoAlianzas,
  getModalEmprendimientos,
  getDetalleEmprendimiento,
  getNuestrosMentores,
  getConoceMentores,
  getMentoriaFinazas,
  getMentoriaImpacto,
  getMentoriaLegal,
  getMentoriaMarketing,
  getMentoriaGestion,
  getMentoriaPostulaciones,
  getMentoriaSistemas,
  getMentoriaEmpoderamiento
};