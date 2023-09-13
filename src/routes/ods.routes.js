import { Router } from 'express'
import { methods as odsController } from './../controllers/ods.controller'
import multer from 'multer'
const authenticate = require('./../middleware/authenticate')

const router = Router()

router.post('/', authenticate, multer().any(), odsController.addOdss) //authenticate
router.get('/', odsController.getOdss)
router.get('/withoutimages', odsController.getOdssWithoutImages)
router.get('/:id', odsController.getOds)
router.put('/:id', authenticate,  multer().any(), odsController.updateOds)
router.delete('/:id', authenticate, odsController.deleteOds)

export default router;