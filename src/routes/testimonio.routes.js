import { Router } from 'express'
import { methods as testimonioController } from './../controllers/testimonio.controller'
const authenticate = require('./../middleware/authenticate')
const { uploadImg } = require('./../middleware/upload');

const router = Router()

router.post('/', uploadImg.single('imagen'), testimonioController.addTestimonios) //authenticate
router.get('/', testimonioController.getTestimonios)
router.get('/:id', testimonioController.getTestimonio)
router.put('/:id', authenticate, uploadImg.single('imagen'), testimonioController.updateTestimonio)
router.delete('/:id', authenticate, testimonioController.deleteTestimonio)

export default router;