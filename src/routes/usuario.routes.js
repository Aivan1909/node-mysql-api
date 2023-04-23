import { Router } from 'express'
import { methods as usuarioController } from '../controllers/usuario.controller'

const router = Router()

router.post('/', usuarioController.addRegistro)
router.post('/getId', usuarioController.getRegistro)
router.post('/login', usuarioController.login)
router.post('/loginAdmin', usuarioController.loginAdmin)
router.post('/loginAdminGoogle', usuarioController.loginAdminGoogle)
router.post('/loginGoogle', usuarioController.loginGoogle)
router.get('/', usuarioController.getRegistros)
router.post('/actualizarRoles', usuarioController.actualizaRoles)
router.put('/cambiarEstado/:id_user', usuarioController.cambiarEstado)
/*router.delete('/:id', usuarioController.deleteAlianza) */

export default router;