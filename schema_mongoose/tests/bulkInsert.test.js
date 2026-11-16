
const mongoose = require("mongoose");
const User = require("../models/User");

describe("Bulk Insert Validation Tests", () => {

    test("should validate multiple valid users", () => {
        const users = [
            new User({
                name: "Vaishu",
                email: "bulk1@example.com",
                role: "student"
            }),
            new User({
                name: "Arun",
                email: "bulk2@example.com",
                role: "instructor"
            })
        ];

        users.forEach(user => {
            expect(user.validateSync()).toBeUndefined();
        });
    });

    test("should reject invalid email in bulk data", () => {
        const users = [
            new User({
                name: "Vaishu",
                email: "invalid-email",
                role: "student"
            }),
            new User({
                name: "Arun",
                email: "bulk2@example.com",
                role: "student"
            })
        ];

        const errors = users.map(user => user.validateSync());

        expect(errors[0]).toBeDefined();
        expect(errors[0].errors.email).toBeDefined();
        expect(errors[1]).toBeUndefined();
    });

    test("should reject missing required name", () => {
        const user = new User({
            email: "bulk3@example.com",
            role: "student"
        });

        const error = user.validateSync();

        expect(error.errors.name).toBeDefined();
    });

    test("should reject invalid role", () => {
        const user = new User({
            name: "Vaishu",
            email: "bulk4@example.com",
            role: "manager"
        });

        const error = user.validateSync();

        expect(error.errors.role).toBeDefined();
    });

});
