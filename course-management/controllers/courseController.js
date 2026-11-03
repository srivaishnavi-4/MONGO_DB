const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const Lesson = require("../models/Lesson");


// CREATE COURSE WITH EMBEDDED LESSONS
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


// CREATE COURSE WITH REFERENCED LESSONS
router.post("/referenced", async (req, res, next) => {

    try {

        const lessonDocuments = await Lesson.insertMany(
            req.body.lessons
        );

        const lessonIds = lessonDocuments.map(
            lesson => lesson._id
        );

        const course = await Course.create({

            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            instructor: req.body.instructor,
            rating: req.body.rating,

            lessons: lessonIds

        });

        res.status(201).json(course);

    } catch (error) {
        next(error);
    }

});


// GET ALL COURSES
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


// GET COURSE BY CATEGORY
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


// GET TOP-RATED COURSES
router.get("/top-rated", async (req, res, next) => {

    try {

        const courses = await Course.findTopRated(4);

        res.json(courses);

    } catch (error) {
        next(error);
    }

});


// COMPARE EMBEDDED AND REFERENCED LESSONS
router.get("/:id/lessons-comparison", async (req, res, next) => {

    try {

        const embeddedCourse = await Course.findById(req.params.id);

        const referencedCourse = await Course.findById(req.params.id)
            .populate("lessons");

        if (!embeddedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({

            course: embeddedCourse.title,

            embeddedLessons: embeddedCourse.embeddedLessons,

            referencedLessons: referencedCourse.lessons

        });

    } catch (error) {
        next(error);
    }

});


// CALCULATE TOTAL DURATION
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

            embeddedDuration: course.embeddedLessons.reduce(
                (total, lesson) => total + lesson.duration,
                0
            ),

            referencedDuration: course.calculateTotalDuration()

        });

    } catch (error) {
        next(error);
    }

});

module.exports = router;