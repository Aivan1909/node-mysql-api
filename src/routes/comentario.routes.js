import { Router } from 'express';
import { methods as comentarioController } from './../controllers/Comentario.controller';
const authenticate = require('./../middleware/authenticate');

const router = Router()

router.post('/', authenticate, comentarioController.addComentario)
router.get('/', comentarioController.getComentarios)
router.get('/:id', comentarioController.getComentario)
router.put('/:id', authenticate, comentarioController.updateComentario)
router.delete('/:id', authenticate, comentarioController.deleteComentario)

export default router;

//router.post('/', multer().any(), odsController.addOdss) //authenticate
