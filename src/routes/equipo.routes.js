import { Router } from 'express';
import { methods as equipoController } from './../controllers/equipo.controller';
const authenticate = require('../middleware/authenticate');
const { isImage } = require('../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, equipoController.addEquipo) //authenticate
router.get('/', equipoController.getEquipos)
router.get('/:id', equipoController.getEquipo)
router.put('/:id', multer().single('imagen'), isImage, equipoController.updateEquipo)
router.delete('/:id', equipoController.deleteEquipo)

export default router;