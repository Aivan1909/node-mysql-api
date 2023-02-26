import { Router } from 'express';
import { methods as horarioController } from './../controllers/horario.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, horarioController.addHorarios) //authenticate
router.get('/', horarioController.getHorarios)
router.get('/:id', horarioController.getHorario)
router.put('/:id', multer().single('imagen'), isImage, horarioController.updateHorario)
router.delete('/:id', horarioController.deleteHorario)

export default router;