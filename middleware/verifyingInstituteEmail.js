import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to verify if the user's email is verified
const verifyEmail = async (req, res, next) => {
	try {
		const token = req.body.verificationToken;
		console.log("this is verification token", token)
		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}
		console.log("this is decoded token", decoded)
		const user = decoded
		req.user = user;

		next();
	} catch (error) {
		console.log("Error in verifyEmail middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default verifyEmail;
