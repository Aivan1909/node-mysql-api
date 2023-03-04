import { Result } from 'express-validator';
import { getConnection } from '../database/database';
import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';

const PUBLIC_URL = process.env.PUBLIC_URL

const _TABLA = "tmunay_equipo"
const _TABLA1 = "tmunay_asesor"
const _TABLA2 = "tmunay_trayectoria"
const _TABLA3 = "tmunay_colaboradores"
const _TABLA4 = "tmunay_alianzas"
const _TABLA5 = "users"
const _TABLA6 = "tmunay_testimonios"
const _TABLA7 = "tmunay_emprendimientos"
const _TABLA8 = "tmunay_horarios"
const _TABLA9 = "tmunay_montos"
const _TABLA10 = "users";
const _TABLA11 = "roless";
const _TABLA12 = "tmunay_mentores";
const _TABLA13 = "tmunay_kumpita";
const _TABLA14 = "tmunay_publicacion";
const _TABLA15 = "tmunay_testimonios";
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





const getSobreMunay = async (req, res) => {
  try {
    const connection = await getConnection()

    let sql1 = `SELECT  CONCAT(A.nombre,' ',A.apellidos) AS nombre,B.cargo,B.imagen,B.redSocial `
    sql1 = sql1 + ` FROM  ${_TABLA5} A LEFT JOIN ${_TABLA} B ON A.id = B.user_id`
    const equipo = await connection.query(sql1)

    let sql2 = `SELECT concat(nombres,' ',apellidos) AS nombre, cargo, redSocial,imagen FROM ${_TABLA1}`
    const asesor = await connection.query(sql2)

    let sql3 = `SELECT nombre,imagen FROM ${_TABLA2}`
    const trayectoria = await connection.query(sql3)

    let sql4 = `SELECT nombre,imagen FROM ${_TABLA3}`
    const colaborador = await connection.query(sql4)

    let sql5 = `SELECT nombre, imagen FROM ${_TABLA4}`
    const alianza = await connection.query(sql5)

    //const result = {}[equipo,asesor,trayectoria,colaborador,alianza]
    const result = { 'equipo': equipo, 'asesor': asesor, 'trayectoria': trayectoria, 'colaborador': colaborador, 'alianza': alianza }

    res.json({ body: result })
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

  const getInicio = async (req, res) => {
    try {
      const connection = await getConnection()
            
      let sql2 = `SELECT concat(nombre,' ', apellidos )  as  nombre ,testimonio,imagen FROM ${_TABLA6}`
      const testimonio = await connection.query(sql2)

      //Obteniendo 
      const foundTestimoniosWithImages = [...testimonio].map((item) => {
        return { ...item, file: getOneFile(item.imagen) };
      });
      

      let sql3 = `SELECT 'registrados' as id ,count(*) as cantidad FROM ${_TABLA7}`
      const emprendimiento = await connection.query(sql3)
      
      let sql4 = `SELECT 'horas' as id, ifnull(sum(duracion), 0) as cantidad FROM ${_TABLA8}`
      const mentoria = await connection.query(sql4)
      
      let sql5 = `SELECT 'monto' as id, ifnull(sum(monto), 0) as cantidad, 'USD' as medida FROM ${_TABLA9}`
      const campana= await connection.query(sql5)
      
      let sql6 = `SELECT TOP 12 * as cantidad FROM ${_TABLA7} ORDER BY fechaCreacion DESC` 
      const topEmpre = await connection.query(sql4)
      //Falta terminar

      const result = {'testimonio':foundTestimoniosWithImages,'impacto':[ emprendimiento[0],mentoria[0],campana[0]]}

      res.json({ body: result})
    } catch (error) {
      res.status(500)
      res.json(error.message)
    }
 }



 //Muestreo User - Admin 1 
 const getMuestreoUser = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT id, estado, email as Correo, apellidos, nombre, fechaCreacion  FROM ${_TABLA10} `
    const usuario = await connection.query(sql1)
    const result = usuario 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Emprendimiento - Admin 2 
const getMuestreoEmprendimiento = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT id, estado as Estado, emprendimiento as Empredimiento, fechaCreacion   FROM ${_TABLA7} `
    const emprendimiento = await connection.query(sql1)
    const result = emprendimiento 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}
 
// Muestreo Mentores - Admin 3 
const getMuestreoMentores = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT A.estado, B.nombre,B.apellidos,B.fechaCreacion FROM ${_TABLA12} A, ${_TABLA10} B WHERE A.user_id = B.id`
    const mentores = await connection.query(sql1)
    const result = mentores 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Kumpitas - Admin 4 
const getMuestreoKumpita = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT A.estado, B.nombre,B.apellidos,B.fechaCreacion FROM ${_TABLA13} A, ${_TABLA10} B WHERE A.user_id = B.id`
    const kumpita = await connection.query(sql1)
    const result = kumpita 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo Cursos - Admin 5 -> (Preguntar a Ivan)

// Muestreo publicaciones  - Admin 6  
const getMuestreoPublicaciones = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT estado, titulo, fechaCreacion, id  FROM ${_TABLA14}  where estado = '1' `
    const publicaciones = await connection.query(sql1)
    const result = publicaciones 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

// Muestreo testimonio  - Admin 7  
const getMuestreoTestimonio = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT concat(nombre," ",apellidos ) as Nombre, fechaCreacion, id  FROM ${_TABLA15}  where estado = '1' `
    const testimonio = await connection.query(sql1)
    const result = testimonio 
    res.json({ body: result})
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
    res.json({ body: result})
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
    res.json({ body: result})
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
    res.json({ body: result})
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
    res.json({ body: result})
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
    res.json({ body: result})
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
    res.json({ body: result})
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
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Equipo - Admin 14
const getMuestreoEquipo = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT  A.id, B.apellidos, B.nombre, B.email , A.fechaCreacion FROM ${_TABLA} A, ${_TABLA5} B  WHERE A.user_id = B.id`
    const equipo = await connection.query(sql1)
    const result = equipo 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Asesores - Admin 15
const getMuestreoAsesor = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT  id, estado, nombres, apellidos, cargo, fechaCreacion FROM ${_TABLA1} WHERE estado = '1'`
    const asesor = await connection.query(sql1)
    const result = asesor 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Trayectoria - Admin 16
const getMuestreoTrayectoria = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT  id, estado, nombre, fechaCreacion FROM ${_TABLA2} WHERE estado = '1'`
    const trayectoria = await connection.query(sql1)
    const result = trayectoria 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Colaboradores - Admin 17
const getMuestreoColaboradores = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = `SELECT  id, estado, nombre, fechaCreacion FROM ${_TABLA3} WHERE estado = '1'`
    const colaborador = await connection.query(sql1)
    const result = colaborador 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//Muestreo Alianzas - Admin 18
const getMuestreoAlianzas = async (req, res) => {
  try {
    const connection = await getConnection()
          
    let sql1 = ` SELECT id, estado, nombre, fechaCreacion FROM ${_TABLA4} WHERE estado = '1'`
    const alianza = await connection.query(sql1)
    const result = alianza 
    res.json({ body: result})
  } catch (error) {
    res.status(500)
    res.json(error.message)
  }
}

//let sql2 = `SELECT nombre,testimonio,imagen FROM ${_TABLA6}`
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
                FROM ${_TABLA7} A  WHERE A.id = ?`;
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
                INNER JOIN ${_TABLA5} B ON A.user_id = B.id
                WHERE A.emprendimientos_id = ?`;
    let result4 = await connection.query(sql4, id);
    const comentario = result4;

    const resultF = {'emprendimiento':foundEmprendimientosWithImages, 'criterio':foundCriterioWithImages, 'ods': foundOdsWithImages, 'comentario': comentario};
    res.json({ body: resultF });
  } catch (error) {
    res.status(500);
    res.json(error.message);
  }
}

//Muestreo Mentores [Solicita tu mentoria]
const getNuestrosMentores = async (req, res) => {
  try {
    const connection = await getConnection();
    //Finanzas 
    let sql1 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =1`;
    let result = await connection.query(sql1);

    let sql2 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
    INNER JOIN ${_TABLA27} B ON A.id = B.area_id
    INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
    INNER JOIN ${_TABLA20} D ON B.area_id = D.id
    WHERE A.estado = '1' and D.id = 1;`
    let result1 = await connection.query(sql2);
    const foundFinanzasWithImages = [...result1].map((item) => {
      return { ...item, file: getOneFile(item.avatar) };
    });

     //Impacto 
     let sql3 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =2`;
     let result2 = await connection.query(sql3);
 
     let sql4 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
     INNER JOIN ${_TABLA27} B ON A.id = B.area_id
     INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
     INNER JOIN ${_TABLA20} D ON B.area_id = D.id
     WHERE A.estado = '1' and D.id = 2;`
     let result3 = await connection.query(sql4);
     const foundImpactoWithImages = [...result3].map((item) => {
       return { ...item, file: getOneFile(item.avatar) };
     });

      //Legal 
      let sql5 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =3`;
      let result4 = await connection.query(sql5);
  
      let sql6 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
      INNER JOIN ${_TABLA27} B ON A.id = B.area_id
      INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
      INNER JOIN ${_TABLA20} D ON B.area_id = D.id
      WHERE A.estado = '1' and D.id = 3;`
      let result5 = await connection.query(sql6);
      const foundLegalWithImages = [...result5].map((item) => {
        return { ...item, file: getOneFile(item.avatar) };
      });
      
      //Marketing
      let sql7 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =4`;
      let result6 = await connection.query(sql7);
  
      let sql8 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
      INNER JOIN ${_TABLA27} B ON A.id = B.area_id
      INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
      INNER JOIN ${_TABLA20} D ON B.area_id = D.id
      WHERE A.estado = '1' and D.id = 4;`
      let result7 = await connection.query(sql8);
      const foundMarketingWithImages = [...result7].map((item) => {
        return { ...item, file: getOneFile(item.avatar) };
      });

      //Gestion Empresarial [planificacion]
      let sql9 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =5`;
      let result8 = await connection.query(sql9);
  
      let sql10 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
      INNER JOIN ${_TABLA27} B ON A.id = B.area_id
      INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
      INNER JOIN ${_TABLA20} D ON B.area_id = D.id
      WHERE A.estado = '1' and D.id = 5;`
      let result9 = await connection.query(sql10);
      const foundGestionWithImages = [...result9].map((item) => {
        return { ...item, file: getOneFile(item.avatar) };
      });

      //Postulacion
      let sql11 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =6`;
      let result10 = await connection.query(sql11);
  
      let sql12 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
      INNER JOIN ${_TABLA27} B ON A.id = B.area_id
      INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
      INNER JOIN ${_TABLA20} D ON B.area_id = D.id
      WHERE A.estado = '1' and D.id = 6;`
      let result11 = await connection.query(sql12);
      const foundPostulacionWithImages = [...result11].map((item) => {
        return { ...item, file: getOneFile(item.avatar) };
      });  

      //Sistemas
      let sql13 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =7`;
      let result12 = await connection.query(sql13);
  
      let sql14 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
      INNER JOIN ${_TABLA27} B ON A.id = B.area_id
      INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
      INNER JOIN ${_TABLA20} D ON B.area_id = D.id
      WHERE A.estado = '1' and D.id = 7;`
      let result13 = await connection.query(sql14);
      const foundSistemasWithImages = [...result13].map((item) => {
        return { ...item, file: getOneFile(item.avatar) };
      }); 
  
      //Sistemas
      let sql15 = `SELECT id,areas_id,nombre FROM ${_TABLA21}  where areas_id =8`;
      let result14 = await connection.query(sql15);
  
      let sql16 = `SELECT C.id, C.avatar FROM ${_TABLA12} A
      INNER JOIN ${_TABLA27} B ON A.id = B.area_id
      INNER JOIN ${_TABLA10} C ON A.user_id = C.id 
      INNER JOIN ${_TABLA20} D ON B.area_id = D.id
      WHERE A.estado = '1' and D.id = 8;`
      let result15 = await connection.query(sql16);
      const foundEmpoderamientoWithImages = [...result15].map((item) => {
        return { ...item, file: getOneFile(item.avatar) };
      }); 


    const resultF = {'finanzas':{'lista':result,'mentores':foundFinanzasWithImages},
                     'impacto':{'lista':result2,'mentores':foundImpactoWithImages},
                     'legal':{'lista':result4,'mentores':foundLegalWithImages},
                     'marketing':{'lista':result6,'mentores':foundMarketingWithImages},
                     'planificacion':{'lista':result8,'mentores':foundGestionWithImages},
                     'postulaciones':{'lista':result10,'mentores':foundPostulacionWithImages},
                     'sistemas':{'lista':result12,'mentores':foundSistemasWithImages},
                     'empoderamiento':{'lista':result14,'mentores':foundEmpoderamientoWithImages},
                     
                    };
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
                INNER JOIN ${_TABLA5} B ON A.user_id = B.id 
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






export const methods = { 
  getSobreMunay, 
  getInicio,
  getMuestreoUser,
  getMuestreoEmprendimiento, 
  getMuestreoMentores,
  getMuestreoKumpita,
  getMuestreoPublicaciones,
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