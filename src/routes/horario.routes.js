import { Router } from 'express';
import { methods as horarioController } from './../controllers/horario.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, multer().single('imagen'), isImage, horarioController.addHorarios) //authenticate
router.get('/', horarioController.getHorarios)
router.get('/:id', horarioController.getHorario)
router.put('/:id', authenticate, multer().single('imagen'), isImage, horarioController.updateHorario)
router.delete('/:id', authenticate, horarioController.deleteHorario)

export default router;