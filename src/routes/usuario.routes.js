import { Router } from 'express'
import { methods as usuarioController } from '../controllers/usuario.controller'
const authenticate = require('./../middleware/authenticate');

const router = Router()

router.post('/', authenticate, usuarioController.addRegistro)
router.post('/getId', usuarioController.getRegistro)
router.post('/login', usuarioController.login)
router.post('/loginAdmin', usuarioController.loginAdmin)
router.post('/loginAdminGoogle', usuarioController.loginAdminGoogle)
router.post('/loginGoogle', usuarioController.loginGoogle)
router.get('/', usuarioController.getRegistros)
router.get('/obtenerXNick/:nick', usuarioController.getRegistroNick)
router.post('/actualizarRoles', authenticate, usuarioController.actualizaRoles)
router.put('/cambiarEstado/:id_user', authenticate, usuarioController.cambiarEstado)
router.delete('/:id', authenticate, usuarioController.deleteRegistro)

export default router;