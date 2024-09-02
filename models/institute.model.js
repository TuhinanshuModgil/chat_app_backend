import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema for storing usernames and emails
const InstituteSchema = new Schema({
    instituteName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    emailDomains: [{
        type: String,
        required: true,
        unique: true,
        trim: true,
        
    }],
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
},
{timestamps: true });

// Compile model from schema
const Institute = mongoose.model('Institute', InstituteSchema);

export default Institute;
