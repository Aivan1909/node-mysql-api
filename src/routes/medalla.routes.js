import { Router } from 'express'
import { methods as medallaController } from './../controllers/medalla.controller'
import multer from 'multer'
const authenticate = require('./../middleware/authenticate')

const router = Router()

router.post('/', authenticate, multer().any(), medallaController.addRegistro) //authenticate
router.get('/nanay', medallaController.getRegistrosNanay)
router.get('/kumpita', medallaController.getRegistrosNanay)
router.get('/nanay/:id', medallaController.getRegistro)
router.get('/kumpita/:id', medallaController.getRegistro)
router.put('/nanay/:id', authenticate, multer().any(), medallaController.updateRegistro)
router.put('/kumpita/:id', authenticate, multer().any(), medallaController.updateRegistro)
router.delete('/nanay/:id', authenticate, medallaController.deleteRegistro)
router.delete('/kumpita/:id', authenticate, medallaController.deleteRegistro)

export default router;