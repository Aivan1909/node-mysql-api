import { Router } from 'express';
import { methods as asesoresController } from './../controllers/asesores.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, multer().single('imagen'), isImage, asesoresController.addAsesor) //authenticate
router.get('/', asesoresController.getAsesores)
router.get('/:id', asesoresController.getAsesor)
router.put('/:id', authenticate, multer().single('imagen'), isImage, asesoresController.updateAsesor)
router.delete('/:id', authenticate, asesoresController.deleteAsesor)

export default router;