import { Router } from 'express'
import { methods as trayectoriaController } from './../controllers/trayectoria.controller'
const authenticate = require('./../middleware/authenticate')
const uploadImg = require('./../middleware/upload');

const router = Router()

router.post('/', uploadImg.single('imagen'), trayectoriaController.addTrayectorias) //authenticate
router.get('/', trayectoriaController.getTrayectorias)
router.get('/:id', trayectoriaController.getTrayectoria)
router.put('/:id', authenticate, uploadImg.single('imagen'), trayectoriaController.updateTrayectoria)
router.delete('/:id', authenticate, trayectoriaController.deleteTrayectoria)

export default router;