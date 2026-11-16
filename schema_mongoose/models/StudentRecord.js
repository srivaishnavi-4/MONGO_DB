const mongoose = require("mongoose");

const studentRecordSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    department: String,
    age: Number
});

module.exports = mongoose.model(
    "StudentRecord",
    studentRecordSchema,
    "student_records"
);