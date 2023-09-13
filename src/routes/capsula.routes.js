import { Router } from 'express';
import { methods as capsulaController } from './../controllers/capsula.controller';
const authenticate = require('./../middleware/authenticate');

const router = Router()

router.post('/', authenticate, capsulaController.addCapsulas)
router.get('/', authenticate, capsulaController.getCapsulas)
router.get('/:id', authenticate, capsulaController.getCapsula)
router.put('/:id', authenticate, capsulaController.updateCapsula)
router.delete('/:id', authenticate, capsulaController.deleteCapsula)

export default router;