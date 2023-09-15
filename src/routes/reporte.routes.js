import { Router } from 'express'
import { methods as usuarioController } from '../controllers/reporte.controller'
const authenticate = require('./../middleware/authenticate');

const router = Router()

router.post('/emprendimiento', authenticate, usuarioController.emprendimiento)

export default router;