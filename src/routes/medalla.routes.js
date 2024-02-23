import { Router } from 'express'
import { methods as medallaController } from './../controllers/medalla.controller'
import { methods as medallaKController } from './../controllers/medallaK.controller'
const { isImage } = require('./../middleware/upload');
import multer from 'multer'
const authenticate = require('./../middleware/authenticate')

const router = Router()

router.post('/nanay', authenticate, multer().single('imagen'), isImage, medallaController.addRegistro) //authenticate
router.post('/kumpita', authenticate, multer().single('imagen'), isImage, medallaKController.addMedallaK) //authenticate
router.get('/nanay', medallaController.getRegistrosNanay)
router.get('/kumpita', medallaKController.getMedallasK)
router.get('/nanay/:id', medallaController.getRegistro)
router.get('/kumpita/:id', medallaKController.getMedallak)
router.put('/nanay/:id', authenticate, multer().single('imagen'), isImage, medallaController.updateRegistro)
router.put('/kumpita/:id', authenticate, multer().single('imagen'), isImage, medallaKController.updateMedallak)
router.delete('/nanay/:id', authenticate, medallaController.deleteRegistro)
router.delete('/kumpita/:id', authenticate, medallaKController.deleteMedallak)

export default router;