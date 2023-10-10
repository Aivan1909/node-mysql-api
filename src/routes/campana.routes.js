import { Router } from 'express';
import { methods as campanaController } from './../controllers/campana.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer'

const router = Router()

router.post('/', authenticate, multer().any(), campanaController.addRegistro)
router.post('/emprendimiento/:linkEmprendimiento', campanaController.getRegistroEmprendimiento)
router.get('/', authenticate, campanaController.getRegistros)
router.get('/:id', authenticate, campanaController.getRegistro)
router.put('/:id', authenticate, multer().any(), campanaController.updateRegistro)
router.put('/cambiarEstado/:id', authenticate, campanaController.cambiarEstado)
router.delete('/:id', authenticate, campanaController.deleteRegistro)

export default router;