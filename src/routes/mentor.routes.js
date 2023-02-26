import { Router } from 'express';
import { methods as mentorController } from './../controllers/mentor.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()
//console.log('Estamos en rutas:')
router.post('/', multer().single('imagen'), isImage, mentorController.addMentores) //authenticate
router.get('/listaesp', mentorController.getListaMentorEsp)
router.get('/listaD', mentorController.getListaMentorD)
router.get('/', mentorController.getMentores)
router.get('/:id', mentorController.getMentor)


router.put('/:id', multer().single('imagen'), isImage, mentorController.updateMentor)
router.delete('/:id', mentorController.deleteMentor)



export default router;