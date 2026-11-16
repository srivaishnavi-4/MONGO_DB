
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
            { amount: 1000 },
            {},
            { amount: null },
            { amount: 2000 }
        ];

        const total = documents.reduce(
            (sum, doc) => sum + (doc.amount || 0),
            0
        );

        expect(total).toBe(3000);
    });

    test("should ignore invalid numeric values safely", () => {
        const documents = [
            { amount: 1000 },
            { amount: "invalid" },
            { amount: 2000 }
        ];

        const total = documents.reduce((sum, doc) => {
            const amount = Number(doc.amount);
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);

        expect(total).toBe(3000);
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
