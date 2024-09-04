// write the code for the group controller

import Group from "../models/groups.model.js";
import User from "../models/user.model.js";

export const getAllGroups = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        console.log("User in group controller", user)
        // find all groups in user.groups
        const groups = await Group.find({ _id: { $in: user.groups } }).select("-messages");
        console.log("this is groups", groups)
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

export const createGroup = async (req, res) => {
    try {
        const { name, institute } = req.body;
        // get all groups in institute
        const groups = await Group.find({ institute });
        
        // check if group already exists
        const group = groups.find((group) => group.name === name);
        if (group) {
            return res.status(400).json({ error: "Group name already taken use something unique :)" });
        }
        const newGroup = new Group({ name, institute });
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}