import { Router } from 'express';
import { generateCocktails } from '../controllers/cocktailController.js';

const router = Router();

router.post('/generate-cocktails', generateCocktails);

export default router;