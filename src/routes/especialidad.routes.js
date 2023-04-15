import { Router } from 'express';
import { methods as especialidadController } from './../controllers/especialidad.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, especialidadController.addEspecialidades) //authenticate
router.post('/area/:linkArea?/:idMentor?', especialidadController.getEspecialidadesArea)
router.get('/', especialidadController.getEspecialidades)
router.get('/:id', especialidadController.getEspecialidad)
router.put('/:id', multer().single('imagen'), isImage, especialidadController.updateEspecialidad)
router.delete('/:id', especialidadController.deleteEspecialidad)

export default router;