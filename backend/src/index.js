import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

// ⚠️ Temporary Debug Block
let authRoutes, messageRoutes;
try {
  authRoutes = (await import("./routes/auth.route.js")).default;
  console.log("✅ Auth routes loaded");
} catch (err) {
  console.error("❌ Failed to load auth.route.js:", err.message);
}
try {
  messageRoutes = (await import("./routes/message.route.js")).default;
  console.log("✅ Message routes loaded");
} catch (err) {
  console.error("❌ Failed to load message.route.js:", err.message);
}

import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (authRoutes) app.use("/api/auth", authRoutes);
if (messageRoutes) app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("🚀 Server is running on PORT: " + PORT);
  connectDB();
});
