import {Router} from 'express';
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { convertToRegionalLanguage, deleteRegionalLanguage, getUserTranslations } from '../controllers/regionalLanguageController.js';

const router=Router();

router.use(authUserMiddleware);

router.post("/convert",convertToRegionalLanguage);
router.get("/get/all",getUserTranslations);
router.delete("/delete/:id",deleteRegionalLanguage);

export default router;