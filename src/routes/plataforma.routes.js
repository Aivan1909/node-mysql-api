import { Router } from 'express';
import { methods as plataformaController } from './../controllers/plataforma.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().single('imagen'), isImage, plataformaController.addPlataformas); //authenticate
router.get('/', plataformaController.getPlataformas);
router.get('/:id', plataformaController.getPlataforma);
router.put('/:id', multer().single('imagen'), isImage, plataformaController.updatePlataforma);
router.delete('/:id', plataformaController.deletePlataforma);

export default router;
