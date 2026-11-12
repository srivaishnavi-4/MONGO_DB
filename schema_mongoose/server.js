require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");

const User=require("./models/User");
const Lesson=require("./models/Lesson");
const Course=require("./models/Course");
const Enrollment=require("./models/Enrollment");

const app=express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));
//Create user
app.post("/api/users", async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
//Re and Deactivate a user 
app.patch("/api/users/:id/status", async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "isActive must be true or false"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: isActive
                ? "User reactivated successfully"
                : "User deactivated successfully",
            user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
//Read all users
app.get("/api/users",async(req,res)=>{
    try{
        const users=await User.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});
//Read one user 
app.get("/api/users/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});
//Update user
app.put("/api/users/:id",async (req,res)=>{
    try{
        const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true,runValidators:true});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});
//Delete User
app.delete("/api/users/:id",async (req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User deleted successfully"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
});


//Create lessons
app.post("/api/lessons",async(req,res)=>{
    try{
        const user=await Lesson.create(req.body);
        res.status(201).json(user);

    }
    catch(error){
        res.status(400).json({message:error.message});
    }
});

//Create referenced lesson
app.post("/api/lessons",async(req,res)=>{
    try{
        const lesson=await Lesson.create(req.body);
        res.status(201).json(lesson);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
});

//Create course
app.post("/api/courses",async(req,res)=>{
    try{
        const course=await Course.create(req.body);
        res.status(201).json(course);

    }catch(error){
        res.status(400).json({message:error.message});
    }   });

       // Top-rated courses
app.get("/api/courses/top-rated", async (req, res) => {
    try{
    const courses = await Course.getTopRated();
    res.status(200).json(courses);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

//Read all the courses

app.get("/api/courses", async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        // Allow only valid sorting fields
        const allowedSortFields = [
            "title",
            "category",
            "rating",
            "createdAt"
        ];

        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                message: "Invalid sort field",
                allowedFields: allowedSortFields
            });
        }

        const skip = (page - 1) * limit;

        const [courses, totalCourses] = await Promise.all([
            Course.find()
                .populate("instructor", "name email")
                .populate("referencedLessons")
                .sort({ [sortBy]: order })
                .skip(skip)
                .limit(limit),

            Course.countDocuments()
        ]);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalCourses / limit),
            totalCourses,
            pageSize: limit,
            courses
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//using title or category

app.get("/api/courses/search", async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || !keyword.trim()) {
            return res.status(400).json({
                message: "Please provide a search keyword"
            });
        }

        const courses = await Course.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } }
            ]
        })
        .populate("instructor", "name email")
        .populate("referencedLessons");

        res.status(200).json({
            totalResults: courses.length,
            courses
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Read course by ID 
app.get("/api/courses/:id",async(req,res)=>{
    try{
        const course=await Course.findById(req.params.id)
        .populate("instructor","name email")
        .populate("referencedLessons");
        if(!course){
            return res.status(404).json({message:"Course not found"});
        }
        res.status(200).json(course);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});
//Update course
app.put("/api/courses/:id",async(req,res)=>{
    try{
        const course=await Course.findByIdAndUpdate(req.params.id,{$set:req.body},
            {new:true,runValidators:true}
        );
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        }
        res.status(200).json(course);
    }catch(error){
        res.status(400).json({message:error.message});
    }
});
//Update a specific embedded lesson using positional $
app.put("/api/courses/:courseId/lessons/:lessonId",async (req,res)=>{
    try{
        const{courseId,lessonId}=req.params;
        const updatedFields={};
        if(req.body.title!==undefined){
            updatedFields["lessons.$.title"]=req.body.title;
        }
        if(req.body.content!==undefined){
            updatedFields["lessons.$.content"]=req.body.content;
        }
        if(req.body.duration!==undefined){
            updatedFields["lessons.$.duration"]=req.body.duration;
        }
        if(Object.keys(updatedFields).length===0){
            return res.status(400).json({
                message:"Provide at least one lesson field to update"
            });
        }
        const result=await Course.updateOne({
            _id:courseId,
            "lessons._id":lessonId
        },
        {$set:updatedFields},{runValidators:true}
    );
       if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Course or lesson not found"
            });
        }

        const course = await Course.findById(courseId);

        const updatedLesson = course.lessons.id(lessonId);

        res.status(200).json({
            message: "Lesson updated successfully",
            lesson: updatedLesson
        });
    }catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//delete a course only if the progress below 50%
app.delete("/api/courses/:id/conditional", async (req, res) => {
    try {
        const courseId = req.params.id;

        const enrollments = await Enrollment.find({
            course: courseId,
            progress: { $gte: 50 }
        });

        if (enrollments.length > 0) {
            return res.status(400).json({
                message: "Cannot delete course because at least one student has progress of 50% or above",
                count: enrollments.length
            });
        }

        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        await Enrollment.deleteMany({ course: courseId });

        res.status(200).json({
            message: "Course deleted successfully because all enrollment progress values are below 50%"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//Delete course only if no enrollments exist
app.delete("/api/courses/:id",async (req,res)=>{
    try{
        const course=await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        }
        const enrollmentCount=await Enrollment.countDocuments({
            course:course._id
        });
        if(enrollmentCount>0){
            return res.status(400).json({
                message:"Cannot delete course because enrollments exist",
                enrollmentCount
            });
        }
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:"Course deleted successfully"
        });
    }catch(error){
        res.status(400).json({message:error.message});
    }
});
//add a new lesson using $push

app.post("/api/courses/:courseId/lessons", async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.courseId,
            {
                $push: {
                    lessons: req.body
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            message: "Lesson added successfully",
            lessons: course.lessons
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//remove a lesson from a course using $pull
app.delete("/api/courses/:courseId/lessons/:lessonId", async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        const result = await Course.updateOne(
            { _id: courseId },
            {
                $pull: {
                    lessons: { _id: lessonId }
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                message: "Lesson not found in this course"
            });
        }

        res.status(200).json({
            message: "Lesson removed successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

    //create enrollment
    
app.post("/api/enrollments", async (req, res) => {
    try {
        const { course, student, progress = 0 } = req.body;

        if (!course || !student) {
            return res.status(400).json({
                message: "Course ID and Student ID are required"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(course) ||
            !mongoose.Types.ObjectId.isValid(student)
        ) {
            return res.status(400).json({
                message: "Invalid Course ID or Student ID format"
            });
        }

        const courseData = await Course.findById(course);

        if (!courseData) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const studentData = await User.findById(student);

        if (!studentData || studentData.role !== "student") {
            return res.status(400).json({
                message: "Enter a valid Student ID"
            });
        }

        const enrollment = await Enrollment.create({
            course,
            student,
            progress
        });

        await Course.findByIdAndUpdate(course, {
            $addToSet: {
                students: student
            }
        });

        res.status(201).json({
            message: "Student enrolled successfully",
            enrollment
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
    //Update enrollment progress
    app.put("/api/enrollments/:id/progress",async (req,res)=>{
        try{
            const enrollment=await Enrollment.findByIdAndUpdate(req.params.id,{$set:{progress:req.body.progress}},
                {new :true,runValidators:true}
            );
            if(!enrollment){
                return res.status(404).json({
                    message:"Enrollment not found"
                });
            }
            res.status(200).json(enrollment);
        }catch(error){
            res.status(400).json({message:error.message});
        }
    });
    //Unenroll student
    app.delete("/api/enrollments/:id",async(req,res)=>{
        try{
            const enrollment=await Enrollment.findByIdAndDelete(
                req.params.id
            );
            if(!enrollment){
                return res.status(404).json({
                    message:"Enrollment not found"
                });
            }
            await Course.findByIdAndUpdate(
                enrollment.course,{
                    $pull:{
                        students:enrollment.student
                    }
                }
            );
            res.status(200).json({
                message:"Student unenrolled successfully"
            });
        }catch(error){
            res.status(400).json({message:error.message});
        }
    });

    //calculate duration
    app.get("/api/courses/:id/duration",async(req,res)=>{
        try{
            const course=await Course.findById(req.params.id);
            if(!course){
                return res.status(404).json({message:"Course not found"});
            }   
            const duration=await course.calculateDuration();
            res.json({duration});
        }catch(error){
            res.status(400).json({message:error.message});
        }   });

        //Courses by category
        app.get("/api/courses/category/:category",async(req,res)=>{
                const courses=await Course.findByCategory(req.params.category); 
                res.json(courses);
        });

        app.post("/api/lessons/bulk",async(req,res)=>{
            try{
                if(!Array.isArray(req.body)){
                    return res.status(400).json({
                        message:"Request body must be an array"
                    });
                }
                if(req.body.length<50){
                    return res.status(400).json({
                        message:"At least 50 lessons are required"
                    });
                }
                const lessons=await Lesson.insertMany(req.body);
                res.status(201).json({
                    message:"Lessons inserted successfully",
                    totalInserted:lessons.length,data:lessons
                });
            }
            catch(error){
                res.status(400).json({
                    message:error.message
                });
            }
        });

        //Bulk insert courses
        app.post("/api/courses/bulk",async(req,res)=>{
            try{
                if(!Array.isArray(req.body)){
                    return res.status(400).json({
                        message:"Request body must be an array"
                    });
                }
                if(req.body.length<50){
                    return res.status(400).json({
                        message:"At least 50 courses are required"
                    });
                }
                const courses=await Course.insertMany(req.body);
                res.status(201).json({
                    message:"Courses inserted successfully",
                    totalInserted:courses.length,
                    data:courses
                });
            }catch(error){
                res.status(400).json({
                    message:error.message
                });
            }
        });

     

// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});