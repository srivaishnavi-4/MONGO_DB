
const logError = require("../utils/errorLogger");

describe("Error Logger Tests", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should log Mongoose validation errors", () => {
        const error = new Error("Email is required");
        error.name = "ValidationError";

        const consoleSpy = jest.spyOn(console, "error")
            .mockImplementation(() => {});

        const result = logError(error, "Create User");

        expect(result.errorType).toBe("Mongoose Validation Error");
        expect(result.operation).toBe("Create User");
        expect(consoleSpy).toHaveBeenCalled();
    });

    test("should log CastError", () => {
        const error = new Error("Invalid ObjectId");
        error.name = "CastError";

        const result = logError(error, "Find User");

        expect(result.errorType).toBe("Mongoose Cast Error");
    });

    test("should log duplicate key errors", () => {
        const error = new Error("Duplicate key");
        error.code = 11000;

        const result = logError(error, "Create User");

        expect(result.errorType).toBe("MongoDB Duplicate Key Error");
        expect(result.message).toBe("Duplicate value detected");
    });

    test("should log general application errors", () => {
        const error = new Error("Something went wrong");

        const result = logError(error, "Update Course");

        expect(result.errorType).toBe("Application Error");
        expect(result.message).toBe("Something went wrong");
    });

});
