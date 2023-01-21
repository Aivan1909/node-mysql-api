import { Router } from 'express';
import { methods as medioController } from './../controllers/medio.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().single('imagen'), isImage, medioController.addmedios); //authenticate
router.get('/', medioController.getmedios);
router.get('/:id', medioController.getmedio);
router.put('/:id', multer().single('imagen'), isImage, medioController.updatemedio);
router.delete('/:id', medioController.deletemedio);

export default router;
