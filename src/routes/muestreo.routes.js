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







export default router;
