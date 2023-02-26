import { Router } from 'express';
import { methods as dashboardController } from '../controllers/dashboard.controller';
const authenticate = require('../middleware/authenticate');

const router = Router();

router.get('/', authenticate, dashboardController.getDashboard);

export default router;
