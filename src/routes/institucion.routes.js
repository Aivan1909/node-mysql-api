import { Router } from 'express';
import { methods as institucionController } from './../controllers/institucion.controller';
const authenticate = require('./../middleware/authenticate');

const router = Router()

router.post('/', authenticate, institucionController.addInstituciones)
router.get('/', institucionController.getInstituciones)
router.get('/:id', institucionController.getInstitucion)
router.put('/:id', authenticate, institucionController.updateInstitucion)
router.delete('/:id', authenticate, institucionController.deleteInstitucion)

export default router;