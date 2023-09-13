import { Router } from 'express';
import { methods as colaboradorController } from './../controllers/colaborador.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, multer().single('imagen'), isImage, colaboradorController.addColaboradores) //authenticate
router.get('/', colaboradorController.getColaboradores)
router.get('/:id', colaboradorController.getColaborador)
router.put('/:id', authenticate, multer().single('imagen'), isImage, colaboradorController.updateColaborador)
router.delete('/:id', authenticate, colaboradorController.deleteColaborador)

export default router;