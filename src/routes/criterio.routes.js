import { Router } from 'express';
import { methods as criterioController } from './../controllers/criterio.controller';
import multer from 'multer'

const router = Router()

router.post('/',  multer().any(),criterioController.addCriterios) //authenticate
router.get('/', criterioController.getCriterios)
router.get('/withoutimages', criterioController.getCriteriosWithoutImages)
router.get('/:id', criterioController.getCriterio)
router.put('/:id', multer().any(), criterioController.updateCriterio)
router.delete('/:id', criterioController.deleteCriterio)

export default router;

//router.post('/', multer().any(), odsController.addOdss) //authenticate
