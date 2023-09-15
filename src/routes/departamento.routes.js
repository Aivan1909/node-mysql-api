import { Router } from 'express';
import { methods as dptoController } from './../controllers/departamento.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, multer().single('imagen'), isImage, dptoController.adddptos); //authenticate
router.get('/', dptoController.getdptos);
router.get('/:id', dptoController.getdpto);
router.put('/:id', authenticate, multer().single('imagen'), isImage, dptoController.updatedpto);
router.delete('/:id', authenticate, dptoController.deletedpto);

export default router;
