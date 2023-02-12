<<<<<<< HEAD
import { Router } from 'express';
import { methods as testimonioController } from './../controllers/testimonio.controller';
const authenticate = require('./../middleware/authenticate');
=======
import { Router } from 'express'
import { methods as testimonioController } from './../controllers/testimonio.controller'
const authenticate = require('./../middleware/authenticate')
>>>>>>> 3e4b7213bd443a2fc14166ad76ba230585ccca95
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

<<<<<<< HEAD
//router.post('/', uploadImg.single('imagen'), testimonioController.addTestimonios) //authenticate
router.post('/', multer().single('imagen'), isImage, testimonioController.addTestimonios); //authenticate
router.get('/', testimonioController.getTestimonios)
router.get('/:id', testimonioController.getTestimonio)
router.put('/:id',  multer().single('imagen'), isImage, testimonioController.updateTestimonio)
router.delete('/:id', testimonioController.deleteTestimonio)
    
=======
router.post('/', authenticate, multer().single('imagen'), isImage, testimonioController.addTestimonios) //authenticate
router.get('/', testimonioController.getTestimonios)
router.get('/:id', testimonioController.getTestimonio)
router.put('/:id', authenticate, multer().single('imagen'), isImage, testimonioController.updateTestimonio)
router.delete('/:id', authenticate, testimonioController.deleteTestimonio)

>>>>>>> 3e4b7213bd443a2fc14166ad76ba230585ccca95
export default router;