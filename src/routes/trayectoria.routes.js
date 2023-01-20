import { Router } from 'express';
import { methods as trayectoriaController } from './../controllers/trayectoria.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().single('imagen'), isImage, trayectoriaController.addTrayectoria); //authenticate
router.get('/', trayectoriaController.getTrayectorias);
router.get('/:id', trayectoriaController.getTrayectoria);
router.put('/:id', multer().single('imagen'), isImage, trayectoriaController.updateTrayectoria);
router.delete('/:id', trayectoriaController.deleteTrayectoria);

export default router;
