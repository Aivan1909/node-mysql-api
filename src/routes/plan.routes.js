import { Router } from 'express';
import { methods as planesController } from './../controllers/plan.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, planesController.addplanes) //authenticate
router.get('/', planesController.getplanes)
router.get('/:id', planesController.getplan)
router.put('/:id', multer().single('imagen'), isImage, planesController.updateplan)
router.delete('/:id', planesController.deleteplan)

export default router;