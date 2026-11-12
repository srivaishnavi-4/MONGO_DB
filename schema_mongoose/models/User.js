
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
        unique: true,
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
    },

    // Active or inactive user
    isActive: {
        type: Boolean,
        default: true
    },

    // Automatically records the date of user creation (UTC)
    addedDate: {
        type: String,
        default: () => new Date().toISOString().slice(0, 10),
        match: /^\d{4}-\d{2}-\d{2}$/
    }

}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
