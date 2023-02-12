import { Router } from 'express';
import { methods as testimonioController } from './../controllers/testimonio.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

//router.post('/', uploadImg.single('imagen'), testimonioController.addTestimonios) //authenticate
router.post('/', multer().single('imagen'), isImage, testimonioController.addTestimonios); //authenticate
router.get('/', testimonioController.getTestimonios)
router.get('/:id', testimonioController.getTestimonio)
router.put('/:id',  multer().single('imagen'), isImage, testimonioController.updateTestimonio)
router.delete('/:id', testimonioController.deleteTestimonio)
    
export default router;