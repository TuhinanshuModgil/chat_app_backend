import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { getGroupMessages, sendGroupMessage } from "../controllers/groupMessage.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/group/:groupId", protectRoute, getGroupMessages);
router.post("/group/:groupId", protectRoute, sendGroupMessage);
export default router;
