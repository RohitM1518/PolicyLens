import { Router } from "express";
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { createMessage, getAllMessages } from "../controllers/messageController.js";

const router = Router();

router.use(authUserMiddleware);

router.post("/create/:chatid", createMessage);
router.post("/create", createMessage);
router.get("/get/:chatId", getAllMessages);

export default router;