
require("dotenv").config();

const { MongoClient } = require("mongodb");
const { performance } = require("perf_hooks");

const DATABASE_NAME = "performanceDB";
const COLLECTION_NAME = "users";

// Support both environment variable naming conventions.
const LOCAL_URI =
    process.env.LOCAL_MONGODB_URI || process.env.LOCAL_MONGO_URI;

const ATLAS_URI =
    process.env.ATLAS_MONGODB_URI || process.env.ATLAS_MONGO_URI;

// Fetch all users and measure query execution time.
async function fetchUsers(environment, connectionString) {
    if (!connectionString) {
        console.error(`${environment}: Connection string is missing.`);
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

        // Start measuring query time.
        const startTime = performance.now();

        // Fetch all user documents.
        const users = await collection.find({}).toArray();

        // Stop measuring query time.
        const endTime = performance.now();

        const queryTime = endTime - startTime;

        console.log(`${environment} Query Results`);
        console.log("--------------------------------");
        console.log("Total users fetched:", users.length);
        console.log("Query execution time:", queryTime.toFixed(2), "ms");

        // Display fetched documents.
        console.log("\nFetched Users:");

        console.log(
            JSON.stringify(users, null, 2)
        );

        return {
            count: users.length,
            time: queryTime
        };

    } catch (error) {
        console.error(`${environment} query failed:`, error.message);
        return null;

    } finally {
        await client.close();
    }
}

// Compare local MongoDB and Atlas performance.
async function main() {
    console.log("MongoDB Fetch Performance Testing");

    // Fetch users from local MongoDB.
    const localResult = await fetchUsers("Local", LOCAL_URI);

    // Fetch users from MongoDB Atlas.
    const atlasResult = await fetchUsers("Atlas", ATLAS_URI);

    console.log("\n========== PERFORMANCE COMPARISON ==========");

    if (localResult) {
        console.log(
            "Local MongoDB:",
            localResult.count,
            "users |",
            localResult.time.toFixed(2),
            "ms"
        );
    } else {
        console.log("Local MongoDB: Failed");
    }

    if (atlasResult) {
        console.log(
            "MongoDB Atlas:",
            atlasResult.count,
            "users |",
            atlasResult.time.toFixed(2),
            "ms"
        );
    } else {
        console.log("MongoDB Atlas: Failed");
    }

    if (localResult && atlasResult) {
        console.log("\nPerformance Analysis:");

        if (localResult.time < atlasResult.time) {
            console.log("Local MongoDB fetched users faster.");
        } else if (atlasResult.time < localResult.time) {
            console.log("MongoDB Atlas fetched users faster.");
        } else {
            console.log("Both environments have similar query times.");
        }

        if (localResult.count !== atlasResult.count) {
            console.log(
                "WARNING: Document counts are different between environments."
            );
        }
    }
}

main().catch(error => {
    console.error("Application error:", error);
    process.exitCode = 1;
});
