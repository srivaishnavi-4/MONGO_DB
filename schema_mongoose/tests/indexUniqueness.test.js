
const User = require("../models/User");

describe("Index Uniqueness Tests", () => {

    test("should define email as a unique field", () => {
        const emailPath = User.schema.path("email");

        expect(emailPath.options.unique).toBe(true);
    });

    test("should define email as a required field", () => {
        const emailPath = User.schema.path("email");

        expect(emailPath.isRequired).toBe(true);
    });

    test("should contain a unique email index", () => {
        const indexes = User.schema.indexes();

        const emailIndex = indexes.find(
            ([fields]) => fields.email === 1
        );

        expect(emailIndex).toBeDefined();
        expect(emailIndex[1].unique).toBe(true);
    });

    test("should reject an invalid email format", () => {
        const user = new User({
            name: "Vaishu",
            email: "invalid-email",
            role: "student"
        });

        const error = user.validateSync();

        expect(error.errors.email).toBeDefined();
    });

});
