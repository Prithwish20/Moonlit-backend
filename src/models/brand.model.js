import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    logo: {
        type: String
    },

    description: {
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const brandModel =
mongoose.model(
    "brands",
    brandSchema
);

export default brandModel;