import { Router } from 'express'
import { methods as perfilController } from '../controllers/perfil.controller'
const authenticate = require('./../middleware/authenticate');

const router = Router()

router.post('/', authenticate, perfilController.addRegistro)
router.get('/', perfilController.getRegistros)
router.get('/:id', perfilController.getRegistro)
router.put('/', authenticate, perfilController.updateRegistro)
router.delete('/', authenticate, perfilController.deleteRegistro)

export default router;