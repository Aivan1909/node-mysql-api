import { Router } from 'express';
import { methods as comentarioController } from './../controllers/Comentario.controller';
import multer from 'multer'

const router = Router()

router.post('/', comentarioController.addComentario)
router.get('/', comentarioController.getComentarios)
router.get('/:id', comentarioController.getComentario)
router.put('/:id', comentarioController.updateComentario)
router.delete('/:id', comentarioController.deleteComentario)

export default router;

//router.post('/', multer().any(), odsController.addOdss) //authenticate
