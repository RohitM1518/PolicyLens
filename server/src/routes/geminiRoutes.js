import { Router } from "express";
import { chatBot, generateSummary, getResponse } from "../controllers/geminiController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = Router();
router.post('/regional/language', getResponse);
// router.post('/chat', chatBot);
router.post('/summary',upload.fields([
    {
        name:'data',
        maxCount:1
    },
]), generateSummary);

export default router;