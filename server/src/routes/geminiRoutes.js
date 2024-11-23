import { Router } from "express";
import { getResponse } from "../controllers/geminiController.js";

const router = Router();
router.post('/', getResponse);

export default router;