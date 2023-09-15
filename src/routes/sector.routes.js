import { Router } from 'express';
import { methods as sectorController } from './../controllers/sector.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router();

router.post('/', authenticate, multer().single('imagen'), isImage, sectorController.addsectores); //authenticate
router.get('/', sectorController.getsectores);
router.get('/:id', sectorController.getsector);
router.put('/:id', authenticate, multer().single('imagen'), isImage, sectorController.updatesector);
router.delete('/:id', authenticate, sectorController.deletesector);

export default router;
