
const User = require("../models/User");

describe("User Model Unit Tests", () => {

    test("should create a valid user", () => {
        const user = new User({
            name: "Vaishu",
            email: "vaishu@example.com",
            role: "student"
        });

        const error = user.validateSync();

        expect(error).toBeUndefined();
    });

    test("should fail when name is missing", () => {
        const user = new User({
            email: "vaishu@example.com"
        });

        const error = user.validateSync();

        expect(error.errors.name).toBeDefined();
    });

    test("should fail when email does not contain @", () => {
        const user = new User({
            name: "Vaishu",
            email: "vaishuexample.com"
        });

        const error = user.validateSync();

        expect(error.errors.email).toBeDefined();
        expect(error.errors.email.message).toBe("Email must include @");
    });

    test("should fail when role is invalid", () => {
        const user = new User({
            name: "Vaishu",
            email: "vaishu@example.com",
            role: "manager"
        });

        const error = user.validateSync();

        expect(error.errors.role).toBeDefined();
    });

    test("should apply default values", () => {
        const user = new User({
            name: "Vaishu",
            email: "vaishu@example.com"
        });

        expect(user.role).toBe("student");
        expect(user.isActive).toBe(true);
        expect(user.addedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test("should trim whitespace from name", () => {
        const user = new User({
            name: "  Vaishu  ",
            email: "vaishu@example.com"
        });

        expect(user.name).toBe("Vaishu");
    });

});
