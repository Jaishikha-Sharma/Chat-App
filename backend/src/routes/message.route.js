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

// Get all users except logged-in user
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages with a specific user
router.get("/:id", protectRoute, getMessages);

// Send message to a user
router.post("/send/:id", protectRoute, sendMessage);

// Clear entire chat with a user - **PUT or DELETE**? Here DELETE is fine
router.delete("/clear/:userId", protectRoute, clearChat);

// Delete a specific message
router.delete("/:id", protectRoute, deleteMessage);

export default router;
