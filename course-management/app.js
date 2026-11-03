const express = require("express");

const app = express();

app.use(express.json());

app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
    res.send("Course Management API is running");
});

app.use((error, req, res, next) => {

    if (error.code === 11000) {
        return res.status(409).json({
            message: "Duplicate record already exists"
        });
    }

    res.status(400).json({
        message: error.message
    });

});

module.exports = app;