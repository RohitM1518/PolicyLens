import { Router } from "express";
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { createMessage, getAllMessages } from "../controllers/messageController.js";
import { upload } from "../middlewares/multerMiddleware.js";
const router = Router();

router.use(authUserMiddleware);

router.post("/create/:chatid",upload.fields([
    {
        name:'attachedFile',
        maxCount:1
    },
]), createMessage);
router.post("/create", upload.fields([
    {
        name:'attachedFile',
        maxCount:1
    },
]), createMessage);
router.get("/get/:chatId", getAllMessages);

export default router;