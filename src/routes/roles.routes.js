import { Router } from 'express';
import { methods as rolesController } from './../controllers/roles.controller';
const authenticate = require('./../middleware/authenticate');
const { isImage } = require('./../middleware/upload');
import multer from 'multer';

const router = Router()

router.post('/', multer().single('imagen'), isImage,rolesController.addRoles) //authenticate
router.get('/', rolesController.getRoles)
router.get('/:id', rolesController.getRol)
router.put('/:id', multer().single('imagen'), isImage, rolesController.updateRol)
router.delete('/:id', rolesController.deleteRol)

export default router;