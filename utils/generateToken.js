import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	console.log("Received userId:", userId);
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "none", // Allow cross-site cookie setting
		secure: true, // Use secure cookies in production
	});
};

export default generateTokenAndSetCookie;
