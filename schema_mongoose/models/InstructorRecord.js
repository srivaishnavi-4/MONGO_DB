const mongoose = require("mongoose");

const instructorRecordSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    department: String,
    age: Number
});

module.exports = mongoose.model(
    "InstructorRecord",
    instructorRecordSchema,
    "instructor_records"
);