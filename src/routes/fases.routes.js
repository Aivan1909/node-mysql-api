import { Router } from 'express';
import { methods as fasesController } from './../controllers/fases.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, fasesController.addFases) //authenticate
router.get('/', fasesController.getFases)
router.get('/:id', fasesController.getFase)
router.put('/:id', multer().single('imagen'), isImage, fasesController.updateFase)
router.delete('/:id', fasesController.deleteFase)

export default router;