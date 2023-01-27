import { Router } from 'express';
import { methods as visibilidadController } from './../controllers/visibilidad.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().single('imagen'), isImage, visibilidadController.addvisibilidades); //authenticate
router.get('/', visibilidadController.getvisibilidades);
router.get('/:id', visibilidadController.getvisibilidad);
router.put('/:id', multer().single('imagen'), isImage, visibilidadController.updatevisibilidad);
router.delete('/:id', visibilidadController.deletevisibilidad);

export default router;
