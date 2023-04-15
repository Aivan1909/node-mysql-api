import { Router } from 'express';
import { methods as areaController } from './../controllers/area.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, areaController.addAreas) //authenticate
router.get('/', areaController.getAreas)
router.get('/muestreo', areaController.getAreasMuestreo)
router.get('/:id', areaController.getArea)
router.put('/:id', multer().single('imagen'), isImage, areaController.updateArea)
router.delete('/:id', areaController.deleteArea)

export default router;