import { Router } from 'express';
import { methods as publicidadController } from './../controllers/publicidad.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().single('imagen'), isImage, publicidadController.addPublicidades); //authenticate
router.get('/', publicidadController.getPublicidades);
router.get('/:id', publicidadController.getPublicidad);
router.put('/:id', multer().single('imagen'), isImage, publicidadController.updatePublicidad);
router.delete('/:id', publicidadController.deletePublicidad);

export default router;
