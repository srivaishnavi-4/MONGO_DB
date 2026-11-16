
const mongoose = require("mongoose");
const Course = require("../models/Course");

describe("Course Model Unit Tests", () => {

    const instructorId = new mongoose.Types.ObjectId();

    test("should create a valid course", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming",
            instructor: instructorId
        });

        const error = course.validateSync();

        expect(error).toBeUndefined();
    });

    test("should fail when title is missing", () => {
        const course = new Course({
            description: "Backend development",
            category: "Programming",
            instructor: instructorId
        });

        const error = course.validateSync();

        expect(error.errors.title).toBeDefined();
    });

    test("should fail when description is missing", () => {
        const course = new Course({
            title: "Node.js",
            category: "Programming",
            instructor: instructorId
        });

        const error = course.validateSync();

        expect(error.errors.description).toBeDefined();
    });

    test("should fail when instructor is missing", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming"
        });

        const error = course.validateSync();

        expect(error.errors.instructor).toBeDefined();
    });

    test("should reject rating greater than 5", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming",
            instructor: instructorId,
            rating: 6
        });

        const error = course.validateSync();

        expect(error.errors.rating).toBeDefined();
    });

    test("should apply default rating", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming",
            instructor: instructorId
        });

        expect(course.rating).toBe(0);
    });

    test("should reject embedded lesson with invalid duration", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming",
            instructor: instructorId,
            lessons: [{
                title: "Introduction",
                content: "Node.js basics",
                duration: 0
            }]
        });

        const error = course.validateSync();

        expect(error).toBeDefined();
        expect(error.errors["lessons.0.duration"]).toBeDefined();
    });

    test("should calculate embedded lesson duration", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming",
            instructor: instructorId,
            lessons: [
                {
                    title: "Introduction",
                    content: "Basics",
                    duration: 30
                },
                {
                    title: "Express",
                    content: "Express basics",
                    duration: 45
                }
            ]
        });

        const total = course.lessons.reduce(
            (sum, lesson) => sum + lesson.duration,
            0
        );

        expect(total).toBe(75);
    });

    test("should calculate completion percentage", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming",
            instructor: instructorId
        });

        course.enrollments = [
            { progress: 50 },
            { progress: 100 }
        ];

        expect(course.completionPercentage).toBe(75);
    });

    test("should return zero completion when no enrollments exist", () => {
        const course = new Course({
            title: "Node.js",
            description: "Backend development",
            category: "Programming",
            instructor: instructorId
        });

        expect(course.completionPercentage).toBe(0);
    });

});
