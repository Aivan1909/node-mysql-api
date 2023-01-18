import { Router } from 'express'
import { methods as odsController } from './../controllers/ods.controller'
const authenticate = require('./../middleware/authenticate')
const uploadImg = require('./../middleware/upload');

const router = Router()

router.post('/', uploadImg.single('imagen'), odsController.addOdss) //authenticate
router.get('/', odsController.getOdss)
router.get('/:id', odsController.getOds)
router.put('/:id', authenticate, uploadImg.single('imagen'), odsController.updateOds)
router.delete('/:id', authenticate, odsController.deleteOds)

export default router;