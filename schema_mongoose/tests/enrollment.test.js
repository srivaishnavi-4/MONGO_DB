
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");

describe("Enrollment Model Unit Tests", () => {

    test("should create enrollment with valid ObjectIds", () => {
        const enrollment = new Enrollment({
            course: new mongoose.Types.ObjectId(),
            student: new mongoose.Types.ObjectId()
        });

        expect(enrollment.course).toBeDefined();
        expect(enrollment.student).toBeDefined();
    });

    test("should fail when course is missing", () => {
        const enrollment = new Enrollment({
            student: new mongoose.Types.ObjectId()
        });

        const error = enrollment.validateSync();

        expect(error.errors.course).toBeDefined();
    });

    test("should fail when student is missing", () => {
        const enrollment = new Enrollment({
            course: new mongoose.Types.ObjectId()
        });

        const error = enrollment.validateSync();

        expect(error.errors.student).toBeDefined();
    });

    test("should apply default progress", () => {
        const enrollment = new Enrollment({
            course: new mongoose.Types.ObjectId(),
            student: new mongoose.Types.ObjectId()
        });

        expect(enrollment.progress).toBe(0);
    });

    test("should reject progress greater than 100", () => {
        const enrollment = new Enrollment({
            course: new mongoose.Types.ObjectId(),
            student: new mongoose.Types.ObjectId(),
            progress: 120
        });

        const error = enrollment.validateSync();

        expect(error.errors.progress).toBeDefined();
    });

    test("should reject negative progress", () => {
        const enrollment = new Enrollment({
            course: new mongoose.Types.ObjectId(),
            student: new mongoose.Types.ObjectId(),
            progress: -10
        });

        const error = enrollment.validateSync();

        expect(error.errors.progress).toBeDefined();
    });

    test("should accept progress between 0 and 100", () => {
        const enrollment = new Enrollment({
            course: new mongoose.Types.ObjectId(),
            student: new mongoose.Types.ObjectId(),
            progress: 75
        });

        const error = enrollment.validateSync();

        expect(error).toBeUndefined();
    });

});
