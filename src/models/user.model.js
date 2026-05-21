import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email is already registered"],
        trim: true,
        lowercase: true,
        match: [emailRegex, "please enter a valid email address"]
      },
    phone: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },

    role: {
        type: String,
        enum: ["USER", "OWNER", "DEVELOPER"],
        default: "USER"
    },

    verified: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});


// Hash password before saving
userSchema.pre("save", async function() {
    if (!this.isModified("password")) {
      return;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  });
  
  // Compare password method
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  

const userModel = mongoose.model("users", userSchema);

export default userModel;