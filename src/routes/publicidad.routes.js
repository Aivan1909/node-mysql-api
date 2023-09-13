import { Router } from 'express';
import { methods as publicidadController } from './../controllers/publicidad.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, multer().single('imagen'), isImage, publicidadController.addPublicidades); //authenticate
router.get('/', publicidadController.getPublicidades);
router.get('/:id', publicidadController.getPublicidad);
router.put('/:id', authenticate, multer().single('imagen'), isImage, publicidadController.updatePublicidad);
router.delete('/:id', authenticate, publicidadController.deletePublicidad);

export default router;
