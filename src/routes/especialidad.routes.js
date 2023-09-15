import { Router } from 'express';
import { methods as especialidadController } from './../controllers/especialidad.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, multer().single('imagen'), isImage, especialidadController.addEspecialidades) //authenticate
router.post('/area/:linkArea?/:idMentor?', authenticate, especialidadController.getEspecialidadesArea)
router.post('/capsula', authenticate, especialidadController.getEspecialidadesCapsula)
router.get('/', especialidadController.getEspecialidades)
router.get('/:id', especialidadController.getEspecialidad)
router.put('/:id', authenticate, multer().single('imagen'), isImage, especialidadController.updateEspecialidad)
router.delete('/:id', authenticate, especialidadController.deleteEspecialidad)

export default router;