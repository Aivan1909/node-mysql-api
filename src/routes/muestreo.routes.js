import { Router } from 'express'
import { methods as muestreoController } from './../controllers/muestreo.controller'
const authenticate = require('./../middleware/authenticate')
const uploadImg = require('./../middleware/upload');

const router = Router()

router.get('/inicio', muestreoController.getInicio)
router.get('/sobre-munay', muestreoController.getSobreMunay)
router.get('/muestreoUser', muestreoController.getMuestreoUser)
router.get('/muestreoEmprendimiento', muestreoController.getMuestreoEmprendimiento)
router.get('/muestreoMentor', muestreoController.getMuestreoEmprendimiento)
router.get('/muestreoKumpita', muestreoController.getMuestreoKumpita)
router.get('/muestreoPublicaciones', muestreoController.getMuestreoPublicaciones)
router.get('/muestreoTestimonio', muestreoController.getMuestreoTestimonio)
router.get('/muestreoSector', muestreoController.getMuestreoSector)
router.get('/muestreoFases', muestreoController.getMuestreoFases)
router.get('/muestreoFigura', muestreoController.getMuestreoFiguraLegal)
router.get('/muestreoOds', muestreoController.getMuestreoOds)
router.get('/muestreoArea', muestreoController.getMuestreoArea)
router.get('/muestreoEspecialidad', muestreoController.getMuestreoEspecializacion)
router.get('/muestreoCriterios', muestreoController.getMuestreoCriterios)
router.get('/muestreoEquipo', muestreoController.getMuestreoEquipo)
router.get('/muestreoAsesor', muestreoController.getMuestreoAsesor)
router.get('/muestreoTrayectoria', muestreoController.getMuestreoTrayectoria)
router.get('/muestreoColaborador', muestreoController.getMuestreoColaboradores)
router.get('/muestreoAlianza', muestreoController.getMuestreoAlianzas)
router.get('/muestreoModalEmprendimiento', muestreoController.getModalEmprendimientos)
router.get('/muestreoDetalleEmprendimiento/:id', muestreoController.getDetalleEmprendimiento)
router.get('/muestreoMentores',muestreoController.getNuestrosMentores)
router.get('/conoceMentores', muestreoController.getConoceMentores)
router.get('/finazas', muestreoController.getMentoriaFinazas)
router.get('/impacto', muestreoController.getMentoriaImpacto)
router.get('/legal', muestreoController.getMentoriaLegal) 
router.get('/marketing', muestreoController.getMentoriaMarketing)
router.get('/gestion', muestreoController.getMentoriaGestion)
router.get('/postulacion', muestreoController.getMentoriaPostulaciones)
router.get('/sistemas', muestreoController.getMentoriaSistemas)
router.get('/empoderamiento', muestreoController.getMentoriaEmpoderamiento)









/* getMentoriaFinazas,
getMentoriaLegal,
getMentoriaMarketing,
getMentoriaGestion,
getMentoriaPostulaciones,
getMentoriaSistemas,
getMentoriaEmpoderamiento */
















export default router;
