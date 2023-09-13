import { Router } from 'express';
import { methods as alianzaController } from './../controllers/alianza.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, multer().single('imagen'), isImage, alianzaController.addAlianza); //authenticate
router.get('/', alianzaController.getAlianzas);
router.get('/:id', alianzaController.getAlianza);
router.put('/:id', authenticate, multer().single('imagen'), isImage, alianzaController.updateAlianza);
router.delete('/:id', authenticate, alianzaController.deleteAlianza);

export default router;
