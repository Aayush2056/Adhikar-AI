import express from 'express';
import { startInterview, continueInterview } from '../controller/formController.js';

const router = express.Router();

// POST route to initiate the form interview after validating form name
router.post('/start', startInterview);

// POST route to continue the conversational interview loop & handle answers/side-questions
router.post('/continue', continueInterview);

export default router;