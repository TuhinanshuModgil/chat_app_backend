import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const { instituteId } = req.params;
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({
			institute: instituteId,
			_id: { $ne: loggedInUserId }
		}).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
