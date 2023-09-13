import { Router } from 'express';
import { methods as rolesController } from './../controllers/roles.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', authenticate, multer().single('imagen'), isImage,rolesController.addRoles) //authenticate
router.get('/', rolesController.getRoles)
router.get('/:id', rolesController.getRol)
router.put('/:id', authenticate, multer().single('imagen'), isImage, rolesController.updateRol)
router.delete('/:id', authenticate, rolesController.deleteRol)

export default router;