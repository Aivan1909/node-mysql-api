import { Router } from 'express';
import { EmprendimientoController } from '../controllers/emprendimiento.controller';
import multer from 'multer';

const router = Router();

router.post('/', EmprendimientoController.addEmprendimiento);
router.post('/imagenes/:id',multer().any(), EmprendimientoController.addImages);
router.get('/imagenes/:id', EmprendimientoController.getImages);

export default router;
