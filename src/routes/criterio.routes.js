import { Router } from 'express';
import { methods as criterioController } from './../controllers/criterio.controller';
const authenticate = require('./../middleware/authenticate');
import multer from 'multer'

const router = Router()

router.post('/', authenticate,  multer().any(),criterioController.addCriterios) //authenticate
router.get('/', criterioController.getCriterios)
router.get('/withoutimages', criterioController.getCriteriosWithoutImages)
router.get('/:id', criterioController.getCriterio)
router.put('/:id', authenticate, multer().any(), criterioController.updateCriterio)
router.delete('/:id', authenticate, criterioController.deleteCriterio)

export default router;

//router.post('/', multer().any(), odsController.addOdss) //authenticate
