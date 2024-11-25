// src/routes/insuranceRoutes.js
import { Router } from 'express';
import { 
    createInsurance,
    getAllInsurances,
    getInsuranceById,
    updateInsurance,
    deleteInsurance
} from '../controllers/insuranceController.js';
import { authUserMiddleware } from '../middlewares/authUserMiddleware.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authUserMiddleware);

router.post('/', createInsurance);
router.get('/', getAllInsurances);
router.get('/:id', getInsuranceById);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

export default router;
