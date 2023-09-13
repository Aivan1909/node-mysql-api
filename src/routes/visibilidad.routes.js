import { Router } from 'express';
import { methods as visibilidadController } from './../controllers/visibilidad.controller';
const authenticate = require('./../middleware/authenticate');

const router = Router();

router.post('/', authenticate, visibilidadController.addvisibilidades); //authenticate
router.get('/', visibilidadController.getvisibilidades);
router.get('/:id', visibilidadController.getvisibilidad);
router.put('/:id', authenticate, visibilidadController.updatevisibilidad);
router.delete('/:id', authenticate, visibilidadController.deletevisibilidad);

export default router;
