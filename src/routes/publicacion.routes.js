import { Router } from 'express';
import { methods as publicacionController } from './../controllers/publicacion.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', publicacionController.addPublicaciones); //authenticate
router.get('/', publicacionController.getPublicaciones);
router.get('/:id', publicacionController.getPublicacion);
router.put('/:id', multer().single('imagen'), isImage, publicacionController.updatePublicacion);
router.delete('/:id', publicacionController.deletePublicacion);

export default router;
