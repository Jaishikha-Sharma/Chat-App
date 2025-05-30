import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage,
  clearChat,
} from "../controllers/message.controller.js";

const router = express.Router();

// **Sabse pehle specific route rakho jo :id se conflict kare**
router.delete("/clear/:userId", protectRoute, clearChat);

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:id", protectRoute, deleteMessage);

export default router;
