import { Router } from 'express';
import { methods as mentorController } from './../controllers/mentor.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()
//console.log('Estamos en rutas:')
router.post('/', authenticate, multer().single('avatar'), isImage, mentorController.addMentores) //authenticate
router.post('/get', mentorController.getMentorId)
router.get('/muestreos', mentorController.getMentoresMuestreos)
router.get('/muestreo/:id', mentorController.getMentoresMuestreo)
router.get('/area/:linkArea', mentorController.getMentoresArea)
router.get('/', mentorController.getMentores)
router.get('/:id', mentorController.getMentor)

router.put('/:id', authenticate, multer().single('avatar'), isImage, mentorController.updateMentor)
router.delete('/:id', authenticate, mentorController.deleteMentor)


export default router;