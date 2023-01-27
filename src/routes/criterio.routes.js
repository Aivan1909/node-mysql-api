import { Router } from 'express';
import { methods as criterioController } from './../controllers/criterio.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, criterioController.addCriterios) //authenticate
router.get('/', criterioController.getCriterios)
router.get('/:id', criterioController.getCriterio)
router.put('/:id', multer().single('imagen'), isImage, criterioController.updateCriterio)
router.delete('/:id', criterioController.deleteCriterio)

export default router;