
require("dotenv").config();

const { MongoClient } = require("mongodb");

const DATABASE_NAME = "performanceDB";
const COLLECTION_NAME = "users";

// Read the simulation setting.
const SIMULATE_FAILURE =
    process.env.SIMULATE_FAILURE === "true";

// Use an intentionally invalid hostname to simulate a DNS/network failure.
const INVALID_URI =
    "mongodb+srv://invalid:invalid@mongodb-network-failure.invalid/";

async function testConnection() {
    const connectionString = SIMULATE_FAILURE
        ? INVALID_URI
        : process.env.ATLAS_MONGO_URI;

    if (!connectionString) {
        console.error("Atlas connection string is missing.");
        return;
    }

    const client = new MongoClient(connectionString, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
    });

    try {
        console.log("\nMongoDB Network Failure Test");
        console.log("--------------------------------");

        if (SIMULATE_FAILURE) {
            console.log("Simulation mode: ENABLED");
            console.log("Using an intentionally invalid hostname.");
        } else {
            console.log("Simulation mode: DISABLED");
            console.log("Using the actual Atlas connection.");
        }

        // Attempt database connection.
        console.log("\nConnecting to MongoDB Atlas...");

        await client.connect();

        console.log("Connection successful!");

        // Verify that the database is responding.
        const database = client.db(DATABASE_NAME);

        await database.command({ ping: 1 });

        console.log("Database ping successful.");

        const collection = database.collection(COLLECTION_NAME);

        const userCount = await collection.countDocuments();

        console.log("Total users available:", userCount);

    } catch (error) {
        console.log("\nConnection failed!");

        console.log("Error name:", error.name);
        console.log("Error message:", error.message);

        if (
            error.name === "MongoServerSelectionError" ||
            error.code === "ENOTFOUND" ||
            error.code === "ECONNREFUSED"
        ) {
            console.log("\nNetwork Error Detected.");

            console.log("Possible reasons:");
            console.log("1. Network connection is unavailable.");
            console.log("2. MongoDB Atlas hostname cannot be reached.");
            console.log("3. DNS resolution failed.");
            console.log("4. MongoDB server is unavailable.");

        } else if (error.code === 18) {
            console.log("\nAuthentication failed.");
            console.log("Check your MongoDB Atlas credentials.");

        } else {
            console.log("\nAn unexpected database error occurred.");
        }

        console.log("\nApplication handled the error without crashing.");

    } finally {
        await client.close();
        console.log("\nMongoDB client connection closed.");
    }
}

testConnection().catch(error => {
    console.error("Unexpected application error:", error.message);
    process.exitCode = 1;
});
