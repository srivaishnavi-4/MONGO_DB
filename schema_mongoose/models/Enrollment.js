
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        validate: {
            validator: async function(value) {
                const Course = mongoose.model("Course");
                return Boolean(await Course.exists({ _id: value }));
            },
            message: "Invalid Course ID. Course does not exist."
        }
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async function(value) {
                const User = mongoose.model("User");

                const user = await User.findById(value)
                    .select("role")
                    .lean();

                return Boolean(user && user.role === "student");
            },
            message: "Invalid Student ID. User must exist and have student role."
        }
    },

    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    enrolledAt: {
        type: Date,
        default:Date.now
    }

}, { timestamps: true });


// Prevent duplicate enrollment
enrollmentSchema.pre("save", async function() {
    if (!this.isNew) return;

    const existing = await this.constructor.findOne({
        course: this.course,
        student: this.student
    });

    if (existing) {
        throw new Error("Student is already enrolled in this course");
    }
});


// Unique course + student combination
enrollmentSchema.index(
    { course: 1, student: 1 },
    { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
