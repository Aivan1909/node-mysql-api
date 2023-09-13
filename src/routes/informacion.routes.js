import { Router } from 'express'
import { methods as informacionController } from '../controllers/informacion.controller'
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, informacionController.addRegistro)
router.get('/', informacionController.getRegistros)
router.get('/:id', informacionController.getRegistro)
router.put('/:id', authenticate, multer().single('imagenQR'), isImage, authenticate, informacionController.updateRegistro)
router.delete('/', authenticate, informacionController.deleteRegistro)

export default router;