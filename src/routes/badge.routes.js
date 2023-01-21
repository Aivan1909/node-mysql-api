import { Router } from 'express';
import { methods as badgesController } from './../controllers/badges.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage, badgesController.addBadges) //authenticate
router.get('/', badgesController.getBadges)
router.get('/:id',badgesController.getBadge)
router.put('/:id', multer().single('imagen'), isImage, badgesController.updateBadge)
router.delete('/:id', badgesController.deleteBadge)

export default router;