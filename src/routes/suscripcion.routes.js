import { Router } from 'express';
import { methods as suscripcionController } from './../controllers/suscripcion.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().single('imagen'), isImage, suscripcionController.addsuscripciones); //authenticate
router.get('/', suscripcionController.getsuscripciones);
router.get('/:id',suscripcionController.getsuscripcion);
router.put('/:id', multer().single('imagen'), isImage, suscripcionController.updatesuscripcion);
router.delete('/:id', suscripcionController.deletesuscripcion);

export default router;
