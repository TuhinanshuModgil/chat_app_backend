// write code to send message to a group

import GroupMessage from "../models/groupMessage.model";
import Group from "../models/groups.model";

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
        const group = await Group.findById(groupId);
        const messages = group.messages;
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}