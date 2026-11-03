const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    progress: {
        type: Number,
        default: 0,

        validate: {
            validator: function(value) {
                return value >= 0 && value <= 100;
            },
            message: "Progress must be between 0 and 100"
        }
    },

    enrolledAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});


// Compound unique index
enrollmentSchema.index(
    { course: 1, student: 1 },
    { unique: true }
);


// PRE-SAVE HOOK
enrollmentSchema.pre("save", async function() {

    if (!this.isNew) {
        return;
    }

    const existingEnrollment = await this.constructor.findOne({
        course: this.course,
        student: this.student
    });

    if (existingEnrollment) {
        throw new Error("Student is already enrolled in this course");
    }

});


module.exports = mongoose.model("Enrollment", enrollmentSchema);