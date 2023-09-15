import { Router } from 'express';
import { methods as mentoriaController } from './../controllers/mentoria.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, multer().single('imagen'), isImage, mentoriaController.addMentorias) //authenticate
router.get('/', mentoriaController.getMentorias)
router.get('/emprendedor/:id', mentoriaController.getMentoriasEmprendedor)
router.get('/muestreo/:tipo?/:mentoria?/:mentor?', mentoriaController.getMentoriasGrupo)
router.get('/:id', mentoriaController.getMentoria)
router.put('/:id', authenticate, multer().single('imagen'), isImage, mentoriaController.updateMentoria)
router.delete('/:id', authenticate, mentoriaController.deleteMentoria)

export default router;