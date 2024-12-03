import { Router } from "express";
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { createNewChat, deleteChat, getChat } from "../controllers/chatController.js";
const router = Router();

router.use(authUserMiddleware);

// router.post("/create", createNewChat);
router.delete("/delete/:id", deleteChat);
router.get("/get/:id", getChat);

export default router;