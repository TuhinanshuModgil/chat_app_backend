import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import sendVerificationEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import VerificationToken from "../models/verificationToken.model.js";

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender,email} = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// https://avatar-placeholder.iran.liara.run/

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			email,
			isVerified:false,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		//saving user temoparily
        await newUser.save();
		const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
		//send verification
		const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
		await sendVerificationEmail(email, verificationLink);

		res.status(201).json({
			message: "Registration successful, please check your email to verify your account.",
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}



		// if (newUser) {
		// 	// Generate JWT token here
		// 	generateTokenAndSetCookie(newUser._id, res);
		// 	await newUser.save();

		// 	res.status(201).json({
		// 		_id: newUser._id,
		// 		fullName: newUser.fullName,
		// 		username: newUser.username,
		// 		profilePic: newUser.profilePic,
		// 	});
		// } else {
		// 	res.status(400).json({ error: "Invalid user data" });
		// };
	// } catch (error) {
	// 	console.log("Error in signup controller", error.message);
	// 	res.status(500).json({ error: "Internal Server Error" });
	// }
};

// Email Verification Controller
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ error: "Invalid token or user doesn't exist" });
        }

        // Set the user's email as verified
        user.isVerified = true;
        await user.save();

        // Log the user in after verification
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log("Error in verifyEmail controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//login controller
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
//logout controller
export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
