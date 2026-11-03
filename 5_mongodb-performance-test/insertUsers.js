
require("dotenv").config();

const { MongoClient } = require("mongodb");
const { performance } = require("perf_hooks");

const DATABASE_NAME = "performanceDB";
const COLLECTION_NAME = "users";
const TOTAL_USERS = 50;

// Generate 50 users only once so both environments receive the same data.
function generateUsers() {
    const runId = Date.now();

    return Array.from({ length: TOTAL_USERS }, (_, index) => {
        const userNumber = index + 1;

        return {
            name: `User${userNumber}`,
            email: `user${userNumber}_${runId}@example.com`,
            age: 20 + (userNumber % 10),
            city: "Coimbatore",
            createdAt: new Date()
        };
    });
}

// Insert users into a database and measure insertion time.
async function insertUsers(environment, connectionString, users) {
    if (!connectionString) {
        console.log(`${environment}: Connection string is missing.`);
        return null;
    }

    const client = new MongoClient(connectionString, {
        serverSelectionTimeoutMS: 10000
    });

    try {
        // Connect to MongoDB.
        await client.connect();

        console.log(`\nConnected to ${environment} MongoDB`);

        const database = client.db(DATABASE_NAME);
        const collection = database.collection(COLLECTION_NAME);

        // Start measuring only the insertion operation.
        const startTime = performance.now();

        const result = await collection.insertMany(users);

        const endTime = performance.now();

        const insertionTime = endTime - startTime;

        console.log(`${environment} Insertion Results`);
        console.log("--------------------------------");
        console.log("Users inserted:", result.insertedCount);
        console.log("Insertion time:", insertionTime.toFixed(2), "ms");

        return insertionTime;

    } catch (error) {
        console.error(`${environment} insertion failed:`, error.message);
        return null;

    } finally {
        await client.close();
    }
}

// Main execution.
async function main() {
    const users = generateUsers();

    console.log("MongoDB Performance Testing");
    console.log("Total users:", TOTAL_USERS);

    // Insert into local MongoDB.
    const localTime = await insertUsers(
    "Local",
    process.env.LOCAL_MONGO_URI,
    users
);

const atlasTime = await insertUsers(
    "Atlas",
    process.env.ATLAS_MONGO_URI,
    users
);
    // Display comparison.
    console.log("\n========== PERFORMANCE COMPARISON ==========");

    console.log(
        "Local MongoDB:",
        localTime === null ? "Failed" : `${localTime.toFixed(2)} ms`
    );

    console.log(
        "MongoDB Atlas:",
        atlasTime === null ? "Failed" : `${atlasTime.toFixed(2)} ms`
    );

    if (localTime !== null && atlasTime !== null) {
        console.log("\nBoth insertions completed successfully.");

        if (localTime < atlasTime) {
            console.log("Local MongoDB was faster.");
        } else if (atlasTime < localTime) {
            console.log("MongoDB Atlas was faster.");
        } else {
            console.log("Both took approximately the same time.");
        }
    } else {
        console.log("\nComparison incomplete. Check the connection errors.");
    }
}

main().catch(error => {
    console.error("Application error:", error);
    process.exitCode = 1;
});
