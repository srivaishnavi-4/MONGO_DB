
const mongoose = require("mongoose");
const Lesson = require("./Lesson");

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    // Referenced lessons
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    }],

    // Embedded lessons
    embeddedLessons: [Lesson.schema],

    // Instructor reference
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Student references
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }

}, {
    timestamps: true
});


// PRE-SAVE HOOK
courseSchema.pre("save", function() {
    this.$locals.wasNew = this.isNew;
});


// POST-SAVE HOOK
courseSchema.post("save", function(doc) {

    if (doc.$locals.wasNew) {
        console.log("New course created:", doc.title);
    }

});


// INSTANCE METHOD
courseSchema.methods.calculateTotalDuration = function(
    source = "embedded"
) {

    if (source === "embedded") {

        return this.embeddedLessons.reduce(
            (total, lesson) => total + lesson.duration,
            0
        );

    }

    if (source === "referenced") {

        if (!this.populated("lessons")) {
            throw new Error(
                "Populate lessons before calculating referenced duration"
            );
        }

        return this.lessons.reduce(
            (total, lesson) => total + lesson.duration,
            0
        );

    }

    throw new Error("Invalid lesson source");

};


// STATIC METHOD: CATEGORY
courseSchema.statics.findByCategory = function(category) {

    return this.find({
        category: category
    });

};


// STATIC METHOD: TOP RATED
courseSchema.statics.findTopRated = function(minRating = 4) {

    return this.find({
        rating: {
            $gte: minRating
        }
    }).sort({
        rating: -1
    });

};


module.exports = mongoose.model("Course", courseSchema);
