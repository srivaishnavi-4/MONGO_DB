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
//Create user
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

    //create enrollment
    app.post("/api/enrollments",async(req,res)=>{
        try{
            const enrollment=await Enrollment.create(req.body);
            await Course.findByIdAndUpdate(
      enrollment.course,
      {
        $addToSet: {
          students: enrollment.student
        }
      }
    );
            res.status(201).json(enrollment);
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

        // Top-rated courses
app.get("/api/courses/top-rated", async (req, res) => {
    const courses = await Course.getTopRated();
    res.json(courses);
});


// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});