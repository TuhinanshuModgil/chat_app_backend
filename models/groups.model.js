import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model

    }],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMessage",
            default: [],
        },
    ],
},
{ timestamps: true });

// Compile model from schema
const Group = mongoose.model('Group', GroupSchema);

export default Group;
