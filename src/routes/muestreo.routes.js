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














export default router;
