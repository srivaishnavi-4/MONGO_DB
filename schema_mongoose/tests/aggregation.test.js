
const mongoose = require("mongoose");
const Course = require("../models/Course");

describe("Aggregation Pipeline Tests", () => {

    test("should detect missing course fields", () => {
        const course = new Course({
            title: "MongoDB",
            description: "MongoDB Course"
        });

        const error = course.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.category).toBeDefined();
        expect(error.errors.instructor).toBeDefined();
    });

    test("should reject invalid rating values", () => {
        const course = new Course({
            title: "Node.js",
            description: "Node Course",
            category: "Backend",
            instructor: new mongoose.Types.ObjectId(),
            rating: 8
        });

        const error = course.validateSync();

        expect(error.errors.rating).toBeDefined();
    });

    test("should use zero for missing numeric values", () => {
        const documents = [
            { duration : 34 },
            {},
            { amount: null },
            { duration : 20 }
        ];

        const total = documents.reduce(
            (sum, doc) => sum + (doc.duration || 0),
            0
        );

        expect(total).toBe(54);
    });

    test("should ignore invalid numeric values safely", () => {
        const documents = [
            { duration: 10 },
            { duration: "invalid" },
            { duration: 20 }
        ];

        const total = documents.reduce((sum, doc) => {
            const duration = Number(doc.duration);
            return sum + (Number.isFinite(duration) ? duration : 0);
        }, 0);

        expect(total).toBe(30);
    });

    test("should return zero for empty aggregation input", () => {
        const documents = [];

        const total = documents.reduce(
            (sum, doc) => sum + (doc.amount || 0),
            0
        );

        expect(total).toBe(0);
    });

});
