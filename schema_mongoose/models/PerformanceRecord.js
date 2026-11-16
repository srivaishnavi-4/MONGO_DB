const mongoose = require("mongoose");

const performanceRecordSchema = new mongoose.Schema({
    runId: String,
    sequence: Number,
    name: String,
    email: String,
    score: Number
});

module.exports = mongoose.model(
    "PerformanceRecord",
    performanceRecordSchema,
    "performance_records"
);