import { Router } from 'express'
import { methods as colaboradorControl } from './../controllers/colaborador.controller'
const authenticate = require('./../middleware/authenticate')
const uploadImg = require('./../middleware/upload');

const router = Router()

router.post('/', uploadImg.single('imagen'), colaboradorControl.addColaboradores) //authenticate
router.get('/', colaboradorControl.getColaboradores)
router.get('/:id', colaboradorControl.getColaborador)
router.put('/:id', authenticate, uploadImg.single('imagen'), colaboradorControl.updateColaborador)
router.delete('/:id', authenticate, colaboradorControl.deleteColaborador)

export default router;