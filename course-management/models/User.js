const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value) {
                return value.includes("@");
            },
            message: "Email must include @"
        }
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student"
    }
}, {
    timestamps: true
});

// Create the unique email index only once
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);