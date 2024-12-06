import { Router } from "express";
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { createSummary, deleteSummary, getAllSummaries, translateSummary } from "../controllers/summaryController.js";

const router = Router();
router.use(authUserMiddleware);

router.post("/create",upload.fields([
    {
        name:'PolicyPdf',
        maxCount:1
    },
]), createSummary);

router.get("/get/all", getAllSummaries);
router.post("/translate/:id", translateSummary);
router.delete("/delete/:id", deleteSummary);

export default router;