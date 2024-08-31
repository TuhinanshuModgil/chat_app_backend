import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    token: { type: String, required: true }, // Token for email verification
    expiresAt: { type: Date, required: true } // Expiration time for the token
});

const VerificationToken = mongoose.model("VerificationToken", verificationTokenSchema);

export default VerificationToken;
