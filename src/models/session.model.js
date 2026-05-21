import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    refreshTokenHash: {
        type: String,
        required: true
    },

    ip: {
        type: String
    },

    userAgent: {
        type: String
    },

    device: {
        type: String
    },

    revoked: {
        type: Boolean,
        default: false
    },

    expiresAt: {
        type: Date,
        required: true
    },

    lastUsedAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});
sessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
  );
  sessionSchema.index({ user: 1 });

  sessionSchema.index({ refreshTokenHash: 1 });
const sessionModel = mongoose.model("sessions", sessionSchema);

export default sessionModel;