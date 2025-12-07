import express from 'express';
import { getExamples, createExample } from '../controllers/example.controller.js';

const router = express.Router();

router.get('/', getExamples);
router.post('/', createExample);

export default router;

