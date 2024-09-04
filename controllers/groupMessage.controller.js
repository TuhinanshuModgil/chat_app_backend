// write code to send message to a group

import GroupMessage from "../models/groupMessages.model.js";
import Group from "../models/groups.model.js";
import { io } from "../socket/socket.js";

export const sendGroupMessage = async (req, res) => {
    try {
        // get groupId from params
        const { groupId } = req.params;
        const { message, senderId } = req.body;
        const newMessage = new GroupMessage({ groupId, message, senderId });
        await newMessage.save();    
        // add message to group messages
        const group = await Group.findById(groupId);
        group.messages.push(newMessage._id);
        await group.save();
        // socket io functionality will go here
       
        io.to(groupId).emit("newGroupMessage", newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// write code to get all messages of a group
export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        // get all messages in a group using group model
        // mongoose aggregate pipeline to get messages of only past 20 days
        
        const group = await Group.findById(groupId).populate("messages");
        const messages = group.messages;
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// controller to get all members of a group members field
export const getGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate("members");
        const members = {}

        // create a map of members with userId as key and member as value
        for(let i = 0; i < group.members.length; i++) {
            members[group.members[i]._id] = group.members[i];
        }

        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

