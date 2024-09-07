import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./db/connectToMongoDB.js";

dotenv.config();

const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;
app.use(cors({
	origin: [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
	credentials: true,
}));
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

app.get("/", (req, res) => {
	// send mongo db connection status
	const mongoStatus = mongoose.connection.readyState;
	let connectionStatus;
	switch (mongoStatus) {
		case 0:
			connectionStatus = "Disconnected";
			break;
		case 1:
			connectionStatus = "Connected";
			break;
		case 2:
			connectionStatus = "Connecting";
			break;
		case 3:
			connectionStatus = "Disconnecting";
			break;
		default:
			connectionStatus = "Unknown";
	}
	res.send(`MongoDB Connection Status: ${connectionStatus}`);
	
});

connectDB()
.then(()=>{
	console.log("Connected to MongoDB")
})
.then(()=>{
	server.listen(PORT, () => {
		console.log(`Server Running on port ${PORT}`);
	})
})
.catch((error)=>{
	console.log("Error connecting to MongoDB: ", error.message)
})

export { app };

