
require("dotenv").config();

const { MongoClient } = require("mongodb");

const environment = process.env.DB_ENV;

let uri;

if (environment === "atlas") {
    uri = process.env.ATLAS_MONGO_URI;
} else if (environment === "local") {
    uri = process.env.LOCAL_MONGO_URI;
} else {
    throw new Error("DB_ENV must be atlas or local");
}

if (!uri) {
    throw new Error(`MongoDB URI missing for ${environment}`);
}

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000
});

async function connectDB() {
    try {
        await client.connect();

        await client.db("admin").command({ ping: 1 });

        console.log(
            `MongoDB ${environment.toUpperCase()} connected successfully!`
        );

        const database = client.db(process.env.DB_NAME);

        return {
            client,
            database
        };

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        await client.close().catch(() => {});

        throw error;
    }
}

module.exports = connectDB;
