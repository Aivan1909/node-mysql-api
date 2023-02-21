import { Router } from 'express';
import { methods as emprendimientoController } from './../controllers/emprendimiento.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', multer().any(), emprendimientoController.addEmprendimiento); //authenticate
router.get('/', emprendimientoController.getEmprendimientos);
router.get('/:id', emprendimientoController.getEmprendimiento);
router.put('/:id', multer().any(), emprendimientoController.updateEmprendimiento);
router.delete('/:id', emprendimientoController.deleteEmprendimiento);
router.put('/cambiarEstado/:id', emprendimientoController.cambiarEstado);

export default router; 
