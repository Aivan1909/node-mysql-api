import { Router } from 'express';
import { methods as figuraController } from './../controllers/figura.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, multer().single('imagen'), isImage, figuraController.addfiguras); //authenticate
router.get('/', figuraController.getfiguras);
router.get('/:id', figuraController.getfigura);
router.put('/:id', authenticate, multer().single('imagen'), isImage, figuraController.updatefigura);
router.delete('/:id', authenticate, figuraController.deletefigura);

export default router;
