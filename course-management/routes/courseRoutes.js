
const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

// 1. Create course with embedded lessons
router.post("/embedded", async (req, res, next) => {
    try {
        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            instructor: req.body.instructor,
            rating: req.body.rating,
            embeddedLessons: req.body.lessons
        });

        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
});

// 2. Create course with referenced lessons
router.post("/referenced", async (req, res, next) => {
    try {
        const lessonDocuments = await Lesson.insertMany(
            req.body.lessons
        );

        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            instructor: req.body.instructor,
            rating: req.body.rating,
            lessons: lessonDocuments.map(lesson => lesson._id)
        });

        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
});

// 3. Get all courses
router.get("/", async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "name email")
            .populate("lessons")
            .populate("students", "name email");

        res.json(courses);
    } catch (error) {
        next(error);
    }
});

// 4. Find courses by category
router.get("/category/:category", async (req, res, next) => {
    try {
        const courses = await Course.findByCategory(
            req.params.category
        );

        res.json(courses);
    } catch (error) {
        next(error);
    }
});

// 5. Find top-rated courses
router.get("/top-rated", async (req, res, next) => {
    try {
        const courses = await Course.findTopRated(4);

        res.json(courses);
    } catch (error) {
        next(error);
    }
});

// 6. Compare embedded and referenced lessons
router.get("/:id/lessons-comparison", async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const referencedCourse = await Course.findById(req.params.id)
            .populate("lessons");

        res.json({
            course: course.title,
            embeddedLessons: course.embeddedLessons,
            referencedLessons: referencedCourse.lessons
        });
    } catch (error) {
        next(error);
    }
});

// 7. Calculate total duration
router.get("/:id/duration", async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("lessons");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            course: course.title,
            embeddedDuration:
                course.calculateTotalDuration("embedded"),
            referencedDuration:
                course.calculateTotalDuration("referenced")
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
