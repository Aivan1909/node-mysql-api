import { Router } from 'express'
import { methods as usuarioController } from '../controllers/usuario.controller'

const router = Router()

router.post('/', usuarioController.addRegistro)
router.post('/login', usuarioController.login)
router.post('/loginAdmin', usuarioController.login)
/*router.get('/:id', usuarioController.getAlianza)
router.put('/:id', usuarioController.updateAlianza)
router.delete('/:id', usuarioController.deleteAlianza) */

export default router;