import { Router } from 'express';
import { methods as emprendimientoController } from './../controllers/emprendimiento.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, multer().any(), isImage, emprendimientoController.addEmprendimiento);
router.post('/usuario', emprendimientoController.getEmprendimientoUser);
router.post('/validarCriterio', emprendimientoController.validarCriterios);
router.get('/', emprendimientoController.getEmprendimientos);
router.get('/:id', emprendimientoController.getEmprendimiento);
router.get('/nombre/:nombre', emprendimientoController.getEmprendimientoNombre);
router.put('/:id', authenticate, multer().any(), emprendimientoController.updateEmprendimiento);
router.delete('/:id', authenticate, emprendimientoController.deleteEmprendimiento);
router.put('/cambiarEstado/:id', authenticate, emprendimientoController.cambiarEstado);
router.post('/email', authenticate, emprendimientoController.sendEmail);

export default router;