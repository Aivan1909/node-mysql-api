import { Router } from 'express';
import { methods as suscripcionController } from './../controllers/suscripcion.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, multer().single('imagen'), isImage, suscripcionController.addsuscripciones); //authenticate
router.get('/', suscripcionController.getsuscripciones);
router.get('/:id',suscripcionController.getsuscripcion);
router.put('/:id', authenticate, multer().single('imagen'), isImage, suscripcionController.updatesuscripcion);
router.delete('/:id', authenticate, suscripcionController.deletesuscripcion);

export default router;
