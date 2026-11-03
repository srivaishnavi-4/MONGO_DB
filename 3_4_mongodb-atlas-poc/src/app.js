
const express = require("express");
const path = require("path");
const connectDB = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve registration form
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

let usersCollection;

// Register user
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, age, city } = req.body;

        if (!name || !email || !age || !city) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            age: Number(age),
            city: city.trim(),
            createdAt: new Date()
        };

        if (!Number.isInteger(user.age) || user.age < 1) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid age"
            });
        }

        const result = await usersCollection.insertOne(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            userId: result.insertedId,
            user
        });

    } catch (error) {
        console.error("User insertion error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to register user"
        });
    }
});

// Fetch all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await usersCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            totalUsers: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start application
async function startServer() {
    let client;

    try {
        const connection = await connectDB();

        client = connection.client;
        usersCollection = connection.database.collection("users");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log(`Database environment: ${process.env.DB_ENV}`);
        });

    } catch (error) {
        console.error("Application startup failed:", error.message);

        if (client) {
            await client.close().catch(() => {});
        }

        process.exitCode = 1;
    }
}

startServer();
