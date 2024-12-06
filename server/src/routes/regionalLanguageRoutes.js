import {Router} from 'express';
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { convertToRegionalLanguage, getUserTranslations } from '../controllers/regionalLanguageController.js';

const router=Router();

router.use(authUserMiddleware);

router.post("/convert",convertToRegionalLanguage);
router.get("/get/all",getUserTranslations);

export default router;