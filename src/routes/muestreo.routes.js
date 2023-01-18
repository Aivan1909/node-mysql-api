import { Router } from 'express'
import { methods as muestreoController } from './../controllers/muestreo.controller'
const authenticate = require('./../middleware/authenticate')
const uploadImg = require('./../middleware/upload');

const router = Router()

router.get('/inicio', muestreoController.getInicio)
router.get('/sobre-munay', muestreoController.getSobreMunay)


export default router;
