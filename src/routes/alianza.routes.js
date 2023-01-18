import { Router } from 'express'
import { methods as alianzaController } from './../controllers/alianza.controller'
const authenticate = require('./../middleware/authenticate')
const uploadImg = require('./../middleware/upload');

const router = Router()

router.post('/', authenticate, uploadImg.single('imagen'), alianzaController.addAlianza)
router.get('/', alianzaController.getAlianzas)
router.get('/:id', alianzaController.getAlianza)
router.put('/:id', authenticate, uploadImg.single('imagen'), alianzaController.updateAlianza)
router.delete('/:id', authenticate, alianzaController.deleteAlianza)

export default router;