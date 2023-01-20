import { Router } from 'express';
import { methods as alianzaController } from './../controllers/alianza.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().single('imagen'), isImage, alianzaController.addAlianza); //authenticate
router.get('/', alianzaController.getAlianzas);
router.get('/:id', alianzaController.getAlianza);
router.put('/:id', multer().single('imagen'), isImage, alianzaController.updateAlianza);
router.delete('/:id', alianzaController.deleteAlianza);

export default router;
