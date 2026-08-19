import express from 'express';
import { getRightsAdvice } from '../controller/rightsController.js';

const router = express.Router();

// POST /api/rights endpoint
router.post('/', getRightsAdvice);

export default router;