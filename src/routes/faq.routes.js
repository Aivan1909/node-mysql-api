import { Router } from 'express';
import { methods as faqController } from './../controllers/faq.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, faqController.addRegistro); //authenticate
router.get('/', faqController.getRegistros);
router.get('/:id', faqController.getRegistro);
router.put('/:id', authenticate, faqController.updateRegistro);
router.delete('/:id', authenticate, faqController.deleteRegistro);

export default router;
