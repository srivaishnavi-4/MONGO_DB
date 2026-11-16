
const request = require("supertest");

const API_URL = "http://127.0.0.1:5000";

describe("User API Integration Tests", () => {

    test("should create a user", async () => {
        const response = await request(API_URL)
            .post("/api/users")
            .send({
                name: "Vaishu",
                email: `integration_${Date.now()}@example.com`,
                role: "student"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("User created successfully");
    });

    test("should reject invalid email", async () => {
        const response = await request(API_URL)
            .post("/api/users")
            .send({
                name: "Vaishu",
                email: "invalid-email",
                role: "student"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain("Email must include @");
    });

    test("should handle test error", async () => {
        const response = await request(API_URL)
            .get("/api/test-error");

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Something went wrong!");
    });

});
