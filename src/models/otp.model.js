import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    otpHash: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        enum: [
            "EMAIL_VERIFICATION",
            "PASSWORD_RESET"
        ],
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});

otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
otpSchema.index({ email: 1 });

otpSchema.index({ user: 1 });

const otpModel = mongoose.model("otps", otpSchema);

export default otpModel;