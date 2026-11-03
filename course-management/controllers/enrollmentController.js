const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");


// CREATE ENROLLMENT
router.post("/", async (req, res, next) => {

    try {

        const enrollment = await Enrollment.create({

            course: req.body.course,
            student: req.body.student,
            progress: req.body.progress || 0

        });

        // Add student to course's students array
        await Course.findByIdAndUpdate(
            req.body.course,
            {
                $addToSet: {
                    students: req.body.student
                }
            }
        );

        res.status(201).json(enrollment);

    } catch (error) {
        next(error);
    }

});


// GET ENROLLMENTS
router.get("/", async (req, res, next) => {

    try {

        const enrollments = await Enrollment.find()
            .populate("course")
            .populate("student", "name email");

        res.json(enrollments);

    } catch (error) {
        next(error);
    }

});


// UPDATE PROGRESS
router.patch("/:id/progress", async (req, res, next) => {

    try {

        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        enrollment.progress = req.body.progress;

        await enrollment.save();

        res.json(enrollment);

    } catch (error) {
        next(error);
    }

});

module.exports = router;