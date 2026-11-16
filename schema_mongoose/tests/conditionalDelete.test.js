
const mongoose = require("mongoose");
const User = require("../models/User");

describe("Conditional Delete Tests", () => {

    test("should identify a matching user for deletion", () => {
        const user = new User({
            name: "Vaishu",
            email: "vaishu@example.com",
            role: "student"
        });

        expect(user.role).toBe("student");
        expect(user.email).toBe("vaishu@example.com");
    });

    test("should handle invalid ObjectId", () => {
        const invalidId = "invalid123";

        expect(mongoose.isValidObjectId(invalidId)).toBe(false);
    });

    test("should identify when delete condition does not match", () => {
        const user = new User({
            name: "Vaishu",
            email: "vaishu@example.com",
            role: "student"
        });

        const deleteCondition = {
            email: "unknown@example.com"
        };

        expect(user.email).not.toBe(deleteCondition.email);
    });

    test("should reject a delete condition targeting the wrong role", () => {
        const user = new User({
            name: "Vaishu",
            email: "vaishu@example.com",
            role: "student"
        });

        const deleteCondition = {
            role: "admin"
        };

        expect(user.role).not.toBe(deleteCondition.role);
    });

});
