import { Router } from 'express'
import { methods as testimonioController } from './../controllers/testimonio.controller'
const authenticate = require('./../middleware/authenticate')
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, multer().single('imagen'), isImage, testimonioController.addTestimonios) //authenticate
router.get('/', testimonioController.getTestimonios)
router.get('/:id', testimonioController.getTestimonio)
router.put('/:id', authenticate, multer().single('imagen'), isImage, testimonioController.updateTestimonio)
router.delete('/:id', authenticate, testimonioController.deleteTestimonio)

export default router;