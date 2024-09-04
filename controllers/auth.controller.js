import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import {sendVerificationEmail} from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import Institute from "../models/institute.model.js";
import Group from "../models/groups.model.js";

export const signup = async (req, res) => {
	try {
		const {username, password, gender,email, instituteId} = req.user;
		console.log("reached signup", req.user)

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// HASH EMAIL HERE
		const hashedEmail = await bcrypt.hash(email, salt);

		// https://avatar-placeholder.iran.liara.run/

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			
			username,
			password: hashedPassword,
			gender,
			email: hashedEmail,
			institute: instituteId,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});
		console.log("user id", newUser._id)

		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
		
			// Add the new user's ID to the institute's users array
			const institute = await Institute.findById(instituteId);
			if (institute) {
				institute.users.push(newUser._id);
				await institute.save();
			} else {
				console.log("Institute not found");
				return res.status(404).json({ error: "Institute not found" });
			}

			// add user to group
			const group = await Group.findOne({ groupName: "Institute Group", institute: instituteId });
			if (group) {
				group.members.push(newUser._id);
				await group.save();
			}
			console.log("group id", group._id)
			// add group to user
			newUser.groups.push(group._id);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				username: newUser.username,
				profilePic: newUser.profilePic,
				institute: newUser.institute,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
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

export const sendMailVerfication = async (req, res) => {
	try {
		const {  username, password, gender, email, instituteName} = req.body;
		console.log("reached sendMailVerfication", req.body)

		const user = await User.findOne({ username });
		const userEmail = await User.findOne({ email });
		const institute = await Institute.findOne({ instituteName });
		let emailValid = false;
		console.log("institute", institute)
		institute.emailDomains.forEach(domain => {
			console.log("domains", domain)
			console.log('email', email)
			console.log("Includes", email.includes(domain))
			if (email.includes(domain)) {
				console.log("reached here")
				emailValid = true;
			}
		});
		if (!emailValid) {
			return res.status(400).json({ error: "Email domain not allowed for this institute" });
		}
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}
		if (userEmail) {
			return res.status(400).json({ error: "Email already exists" });
		}

		//saving user temoparily
		const verificationToken = jwt.sign({  username, password, gender,email, instituteId: institute._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
}
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
			username: user.username,
			profilePic: user.profilePic,
			institute: user.institute,
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
