require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./models/User");
const Lesson = require("./models/Lesson");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");

const seedDatabase = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database connected");

        // Clear previous sample data
        await Enrollment.deleteMany({});
        await Course.deleteMany({});
        await Lesson.deleteMany({});
        await User.deleteMany({});

        // CREATE USERS
        const instructor = await User.create({
            name: "Vaishu",
            email: "vaishu@example.com",
            role: "instructor"
        });

        const student = await User.create({
            name: "Arun",
            email: "arun@example.com",
            role: "student"
        });

        // LESSON DATA
        const lessonData = [
            {
                title: "Introduction to Node.js",
                content: "Learn Node.js fundamentals",
                duration: 30
            },
            {
                title: "Express.js",
                content: "Learn Express routing and middleware",
                duration: 45
            },
            {
                title: "MongoDB",
                content: "Learn MongoDB and Mongoose",
                duration: 60
            }
        ];

        // CREATE REFERENCED LESSON DOCUMENTS
        const lessons = await Lesson.insertMany(lessonData);

        const lessonIds = lessons.map(
            lesson => lesson._id
        );

        // CREATE COURSE WITH BOTH APPROACHES
        const course = await Course.create({

            title: "Node.js Full Course",

            description: "Complete backend development course",

            category: "Backend Development",

            instructor: instructor._id,

            students: [student._id],

            rating: 4.8,

            // Embedded documents
            embeddedLessons: lessonData,

            // Referenced documents
            lessons: lessonIds

        });

        console.log("Course created:", course.title);

        // CREATE ENROLLMENT
        const enrollment = await Enrollment.create({

            course: course._id,

            student: student._id,

            progress: 25

        });

        console.log("Enrollment created:", enrollment._id);

        console.log("\nSeed data inserted successfully");

        console.log({
            instructor: instructor._id,
            student: student._id,
            course: course._id,
            enrollment: enrollment._id
        });

    } catch (error) {

        console.error("Seed error:", error);

    } finally {

        await mongoose.disconnect();

    }

};

seedDatabase();