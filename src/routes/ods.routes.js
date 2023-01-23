import { Router } from 'express'
import { methods as odsController } from './../controllers/ods.controller'
import multer from 'multer'
const authenticate = require('./../middleware/authenticate')
const { uploadImg } = require('./../middleware/upload');

const router = Router()

router.post('/', multer().any(), odsController.addOdss) //authenticate
router.get('/', odsController.getOdss)
router.get('/withoutimages', odsController.getOdssWithoutImages)
router.get('/:id', odsController.getOds)
router.put('/:id',  multer().any(), odsController.updateOds)
router.delete('/:id', odsController.deleteOds)

export default router;