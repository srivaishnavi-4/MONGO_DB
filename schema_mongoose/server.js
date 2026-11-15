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

        const allowedSortFields = [
            "title",
            "description",
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

//Add text index on course.title + course.description.
app.get("/api/courses/text-search", async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({
        message: "Keyword is required"
      });
    }

    const result = await Course.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    console.log("Text Search Results:", result);

    res.status(200).json({
      keyword,
      totalCourses: result.length,
      data: result
    });
  } catch (error) {
    console.error("Course Text Search Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

//complete status
app.get("/api/courses/completion-stats", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("enrollments", "student progress");

    const result = courses.map(course => ({
      courseId: course._id,
      title: course.title,
      totalStudents: course.enrollments.length,
      completionPercentage: course.completionPercentage
    }));

    res.status(200).json({
      totalCourses: result.length,
      courses: result
    });
  } catch (error) {
    console.error("Completion Stats Error:", error);
    res.status(500).json({ message: error.message });
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

//cascade delete
app.delete("/api/courses/:courseId/cascade", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const enrollmentResult = await Enrollment.deleteMany({
      course: courseId
    });

    const courseResult = await Course.deleteOne({
      _id: courseId
    });

    res.status(200).json({
      message: "Course and related enrollments deleted successfully",
      deletedCourse: course.title,
      deletedEnrollments: enrollmentResult.deletedCount,
      deletedCourses: courseResult.deletedCount
    });
  } catch (error) {
    console.error("Cascade Delete Error:", error);

    res.status(500).json({
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

    //Phase4: Aggregation
    //Get top 5 courses by student count
    app.get("/api/analytics/courses/top-by-students",async (req,res)=>{
        try{
            const result=await Enrollment.aggregate([
                {$group:{
                    _id:"$course",
                    studentCount:{$sum:1}
                }},
                {$lookup:
                    {
                        from:"courses",
                        localField:"_id",
                        foreignField:"_id",
                        as:"courseDetails"
                    }
                },
                {
                    $unwind:"$courseDetails"
                },
                {
                    $sort:{
                        studentCount:-1,
                    }
                },
                {$limit:5},
                {$project:{
                    _id:0,
                    courseId:"$_id",
                    title:"$courseDetails.title",
                    category:"$courseDetails.category",
                    studentCount:1
                }}
            ]);

            console.log("Top 5 Courses by Student Count:");
            console.log(result);
            
            res.status(200).json({
                totalCourses:result.length,
                data:result
            });
        }catch(error){
            res.status(500).json({
                message:error.message
            });
        }
    });

    //Average student progress per course
    app.get("/api/analytics/courses/average-progress",async(req,res)=>{
        try{
            const result=await Enrollment.aggregate([
                {$group:{
                    _id:"$course",
                    averageProgress:{$avg:"$progress"},
                    totalStudents:{$sum:1}
                }},
                {$lookup:{from:"courses",localField:"_id",foreignField:"_id",as:"courseDetails"}},
                {$unwind:"$courseDetails"},
                {$project:{
                    _id:0,courseId:"$_id",title:"$courseDetails.title",averageProgress:{
                        $round:["$averageProgress",2]
                    },totalStudents:1
                }},{
                    $sort:{
                        averageProgress:-1
                    }
                }
            ]);
            console.log("Average student Progress Per Course:");
            console.log(result);
            res.status(200).json({
                totalCourses:result.length,
                data:result
            });
        }catch(error){
            res.status(500).json({
                message:error.message
            });
        }
    });

    //Get total lesson duration per course
    app.get("/api/analytics/courses/total-duration",async(req,res)=>{
        try{
            const result=await Course.aggregate([
                {$unwind:"$lessons"},
                {$group:{
                    _id:"$_id",
                    courseTitle:{$first:"$title"},
                    totalDuration:{$sum:"$lessons.duration"},
                    totalLessons:{$sum:1}
                }},
                {$project:{
                    _id:0,
                    courseId:"$_id",
                    courseTitle:1,
                    totalDuration:1,
                    totalLessons:1
                }},
                {$sort:{
                    totalDuration:-1
                }}
            ]);
            console.log("Total lesson duration per Course:");
            console.log(result);
            res.status(200).json({
                totalCourses:result.length,
                data:result
            });
        }catch(error){
            res.status(500).json({
                message:error.message
            });
        }
    });

    //List students who completed all lessons in a course
    app.get("/api/analytics/courses/completed-students",async (req,res)=>{
        try{
            const result=await Enrollment.aggregate([
                {
                    $match:{
                        progress:100
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"student",
                        foreignField:"_id",
                        as:"studentDetails"
                    }
                },
                {
                    $unwind:"$studentDetails"
                },
                {$lookup:{
                    from:"courses",
                    localField:"course",
                    foreignField:"_id",
                    as:"courseDetails"
                }},{
                    $unwind:"$courseDetails"
                },
                {
                    $project:{
                        _id:0,studentId:"$studentDetails._id",
                        studentName:"$studentDetails.name",
                        email:"$studentDetails.email",
                        courseId:"$courseDetails._id",
                        courseTitle:"$courseDetails.title",
                        progress:1
                    }
                },{$sort:{
                    studentName:1
                }}
            ]);
            console.log("Students who completed their course:");
            console.log(result);
            res.status(200).json({
                totalCompletedEnrollments:result.length,
                data:result
            });
        }catch(error){
            console.error("Completed status error:",error);
            res.status(500).json({
                message:"Failed to fetch completed students",
                error:error.message
            });
        }
    });
//count number of enrollments per instructor
app.get("/api/analytics/instructors/enrollments", async (req, res) => {
  try {
    const result = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $unwind: "$courseDetails"
      },
      {
        $group: {
          _id: "$courseDetails.instructor",
          totalEnrollments: { $sum: 1 },
          courses: { $addToSet: "$courseDetails._id" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "instructorDetails"
        }
      },
      {
        $unwind: "$instructorDetails"
      },
      {
        $project: {
          _id: 0,
          instructorId: "$_id",
          instructorName: "$instructorDetails.name",
          totalEnrollments: 1,
          totalCourses: { $size: "$courses" }
        }
      },
      {
        $sort: {
          totalEnrollments: -1
        }
      }
    ]);

    console.log("Enrollment Count Per Instructor:");
    console.log(result);

    res.status(200).json({
      totalInstructors: result.length,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
//inactive in last 30 days
app.get("/api/analytics/students/inactive", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    const result = await Enrollment.aggregate([
      {
        $match: {
          updatedAt: {
            $lt: thirtyDaysAgo
          },
          progress: { $lt: 100 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "studentDetails"
        }
      },
      { $unwind: "$studentDetails" },
      {
        $group: {
          _id: "$student",
          studentName: { $first: "$studentDetails.name" },
          email: { $first: "$studentDetails.email" },
          inactiveEnrollments: { $sum: 1 },
          lastUpdatedAt: { $max: "$updatedAt" }
        }
      },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          studentName: 1,
          email: 1,
          inactiveEnrollments: 1,
          lastUpdatedAt: 1
        }
      }
    ]);

    console.log("Current Date:", new Date());
    console.log("30 Days Ago:", thirtyDaysAgo);
    console.log("Inactive Students:", result);

    res.status(200).json({
      totalInactiveStudents: result.length,
      cutoffDate: thirtyDaysAgo,
      data: result
    });
  } catch (error) {
    console.error("Inactive Students Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

//$facet and course statics in a single query
app.get("/api/analytics/dashboard", async (req, res) => {
  try {
    const result = await Enrollment.aggregate([
      {
        $facet: {
          courseStatistics: [
            {
              $group: {
                _id: null,
                totalEnrollments: { $sum: 1 },
                averageProgress: { $avg: "$progress" },
                highestProgress: { $max: "$progress" },
                lowestProgress: { $min: "$progress" }
              }
            },
            {
              $project: {
                _id: 0,
                totalEnrollments: 1,
                averageProgress: { $round: ["$averageProgress", 2] },
                highestProgress: 1,
                lowestProgress: 1
              }
            }
          ],
          topStudents: [
            { $sort: { progress: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentDetails"
              }
            },
            { $unwind: "$studentDetails" },
            {
              $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courseDetails"
              }
            },
            { $unwind: "$courseDetails" },
            {
              $project: {
                _id: 0,
                studentName: "$studentDetails.name",
                email: "$studentDetails.email",
                courseTitle: "$courseDetails.title",
                progress: 1
              }
            }
          ]
        }
      }
    ]);

    console.log("Dashboard Analytics:");
    console.log(result);

    res.status(200).json({
      data: result[0]
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

app.get("/api/analytics/courses/duration-buckets", async (req, res) => {
  try {
    const result = await Course.aggregate([
      {
        $unwind: "$lessons"
      },
      {
        $group: {
          _id: "$_id",
          courseTitle: { $first: "$title" },
          totalDuration: { $sum: "$lessons.duration" }
        }
      },
      {
        $bucket: {
          groupBy: "$totalDuration",
          boundaries: [0, 30, 60, 90, 120,150,180,210,240],
          default: "240+",
          output: {
            totalCourses: { $sum: 1 },
            courses: {
              $push: {
                title: "$courseTitle",
                totalDuration: "$totalDuration"
              }
            },
            averageDuration: { $avg: "$totalDuration" }
          }
        }
      }
    ]);

    console.log("Course Duration Buckets:");
    console.log(result);

    res.status(200).json({
      totalBuckets: result.length,
      data: result
    });
  } catch (error) {
    console.error("Course Duration Bucket Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

//Combine $lookup with $group to get student progress per course.
app.get("/api/analytics/courses/student-progress", async (req, res) => {
  try {
    const result = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $unwind: "$courseDetails"
      },
      {
        $group: {
          _id: "$course",
          courseTitle: { $first: "$courseDetails.title" },
          totalStudents: { $sum: 1 },
          averageProgress: { $avg: "$progress" },
          highestProgress: { $max: "$progress" },
          lowestProgress: { $min: "$progress" },
          students: {
            $push: {
              studentId: "$student",
              progress: "$progress"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          courseId: "$_id",
          courseTitle: 1,
          totalStudents: 1,
          averageProgress: { $round: ["$averageProgress", 2] },
          highestProgress: 1,
          lowestProgress: 1,
          students: 1
        }
      },
      {
        $sort: { totalStudents: -1 }
      }
    ]);

    console.log("Student Progress Per Course:");
    console.log(result);

    res.status(200).json({
      totalCourses: result.length,
      data: result
    });
  } catch (error) {
    console.error("Student Progress Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

 //unique index on email

app.post("/api/indexes/users/email", async (req, res) => {
  try {
    const result = await User.collection.createIndex(
      { email: 1 },
      { unique: true }
    );

    console.log("Unique Email Index Created:", result);

    const indexes = await User.collection.indexes();

    res.status(200).json({
      message: "Unique index on users.email created successfully",
      indexName: result,
      indexes
    });
  } catch (error) {
    console.error("Email Index Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});
//compound index on role and email 

app.post("/api/indexes/users/role-email", async (req, res) => {
  try {
    const result = await User.collection.createIndex(
      { role: 1, email: 1 },
      { name: "role_email_compound_idx" }
    );

    const indexes = await User.collection.indexes();

    console.log("Compound Index Created:", result);
    console.log("Current User Indexes:", indexes);

    res.status(200).json({
      message: "Compound index on role and email created successfully",
      indexName: result,
      indexes
    });
  } catch (error) {
    console.error("Compound Index Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});


app.post("/api/indexes/courses/text", async (req, res) => {
  try {
    const result = await Course.collection.createIndex(
      { title: "text", description: "text" },
      { name: "course_text_idx" }
    );

    const indexes = await Course.collection.indexes();

    console.log("Course Text Index Created:", result);

    res.status(200).json({
      message: "Text index created successfully",
      indexName: result,
      indexes
    });
  } catch (error) {
    console.error("Course Text Index Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});


const { performance } = require("perf_hooks");

//Measure query time before and after indexes.
app.get("/api/analytics/index-performance", async (req, res) => {
  try {
    const filter = {
      role: "student",
      email: "niranj@gmail.com"
    };

    const beforeStart = performance.now();

    await User.collection.dropIndex("role_email_compound_idx").catch(error => {
      if (error.codeName !== "IndexNotFound") {
        throw error;
      }
    });

    await User.find(filter).lean();

    const beforeTime = performance.now() - beforeStart;

    const beforeExplain = await User.find(filter)
      .explain("executionStats");

    await User.collection.createIndex(
      { role: 1, email: 1 },
      { name: "role_email_compound_idx" }
    );

    const afterStart = performance.now();

    await User.find(filter).lean();

    const afterTime = performance.now() - afterStart;

    const afterExplain = await User.find(filter)
      .explain("executionStats");

    res.status(200).json({
      beforeIndex: {
        executionTimeMs: Number(beforeTime.toFixed(3)),
        executionStats: beforeExplain.executionStats
      },
      afterIndex: {
        executionTimeMs: Number(afterTime.toFixed(3)),
        executionStats: afterExplain.executionStats
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
//explain() on slow queries

app.get("/api/analytics/query-explain", async (req, res) => {
  try {
    const filter = { role: "student" };

    const result = await User.find(filter).explain("executionStats");

    console.log("Query Execution Plan:");
    console.log(result);

    res.status(200).json({
      query: filter,
      executionStats: result.executionStats,
      winningPlan: result.queryPlanner.winningPlan
    });
  } catch (error) {
    console.error("Explain Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

app.get("/api/analytics/lessons/embedded/:courseId", async (req, res) => {
  try {
    const start = performance.now();

    const result = await Course.findById(req.params.courseId).lean();

    const executionTime = performance.now() - start;

    res.status(200).json({
      type: "Embedded Lessons",
      executionTimeMs: Number(executionTime.toFixed(3)),
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//comparing the performance of embedded and referrenced lessons
app.get("/api/analytics/lessons/referenced/:courseId", async (req, res) => {
  try {
    const start = performance.now();

    const result = await Course.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.courseId)
        }
      },
      {
        $lookup: {
          from: "lessons",
          localField: "referrencedLesson",
          foreignField: "_id",
          as: "lessonDetails"
        }
      }
    ]);

    const executionTime = performance.now() - start;

    res.status(200).json({
      type: "Referenced Lessons",
      executionTimeMs: Number(executionTime.toFixed(3)),
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/api/analytics/optimize-users", async (req, res) => {
  try {
    const filter = {
      role: "student",
      isActive: true
    };

    const before = await User.find(filter)
      .explain("executionStats");

    await User.collection.createIndex(
      { role: 1, isActive: 1 },
      { name: "role_active_idx" }
    );

    const after = await User.find(filter)
      .explain("executionStats");

    console.log("Before Optimization:");
    console.log(before.executionStats);

    console.log("After Optimization:");
    console.log(after.executionStats);

    res.status(200).json({
      message: "Query optimization comparison",
      before: {
        winningPlan: before.queryPlanner.winningPlan,
        executionStats: before.executionStats
      },
      after: {
        winningPlan: after.queryPlanner.winningPlan,
        executionStats: after.executionStats
      }
    });
  } catch (error) {
    console.error("Query Optimization Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

//
app.post("/api/performance/seed-users", async (req, res) => {
  try {
    await User.deleteMany({
      email: /^phase5_perf_/
    });

    const testUsers = Array.from({ length: 1000 }, (_, i) => ({
      name: `Phase5 User ${i + 1}`,
      email: `phase5_perf_${i + 1}@example.com`,
      role: "student",
      isActive: i % 2 === 0,
      addedDate: new Date().toISOString().slice(0, 10)
    }));

    const writeStart = performance.now();

    const result = await User.insertMany(testUsers);

    const writeTime = performance.now() - writeStart;

    console.log("Inserted Users:", result.length);
    console.log("Write Time:", writeTime.toFixed(2), "ms");

    res.status(201).json({
      message: "1000 test users inserted successfully",
      insertedCount: result.length,
      writeTimeMs: Number(writeTime.toFixed(2))
    });
  } catch (error) {
    console.error("Bulk Insert Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/performance/read-users", async (req, res) => {
  try {
    const readStart = performance.now();

    const users = await User.find({
      email: /^phase5_perf_/
    }).lean();

    const readTime = performance.now() - readStart;

    console.log("Fetched Users:", users.length);
    console.log("Read Time:", readTime.toFixed(2), "ms");

    res.status(200).json({
      totalUsers: users.length,
      readTimeMs: Number(readTime.toFixed(2)),
      data: users
    });
  } catch (error) {
    console.error("Read Performance Error:", error);
    res.status(500).json({ message: error.message });
  }
});

//
app.get("/api/analytics/drop-index-performance", async (req, res) => {
  try {
    const filter = {
      role: "student",
      isActive: true
    };

    const before = await User.find(filter).explain("executionStats");

    const droppedIndex = await User.collection.dropIndex("role_active_idx");

    const after = await User.find(filter).explain("executionStats");

    res.status(200).json({
      message: "Index dropped and query performance compared",
      droppedIndex,
      before: {
        winningPlan: before.queryPlanner.winningPlan,
        executionStats: before.executionStats
      },
      after: {
        winningPlan: after.queryPlanner.winningPlan,
        executionStats: after.executionStats
      }
    });
  } catch (error) {
    console.error("Drop Index Performance Error:", error);
    res.status(500).json({ message: error.message });
  }
});

//
app.get("/api/analytics/index-report", async (req, res) => {
  try {
    const userIndexes = await User.collection.indexes();
    const courseIndexes = await Course.collection.indexes();

    const emailQuery = await User.find({
      email: "niranj@gmail.com"
    }).explain("executionStats");

    const roleEmailQuery = await User.find({
      role: "student",
      email: "niranj@gmail.com"
    }).explain("executionStats");

    const roleActiveQuery = await User.find({
      role: "student",
      isActive: true
    }).explain("executionStats");

    const textSearchQuery = await Course.find({
      $text: { $search: "JavaScript" }
    }).explain("executionStats");

    res.status(200).json({
      message: "Index performance report",
      indexes: {
        users: userIndexes,
        courses: courseIndexes
      },
      queryPerformance: {
        emailSearch: emailQuery.executionStats,
        roleEmailSearch: roleEmailQuery.executionStats,
        roleActiveSearch: roleActiveQuery.executionStats,
        courseTextSearch: textSearchQuery.executionStats
      }
    });
  } catch (error) {
    console.error("Index Report Error:", error);
    res.status(500).json({ message: error.message });
  }
});


//Phase6 Fetch a course will all enrolled students using populate
app.get("/api/courses/:courseId/enrolled-students", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(courseId).lean();

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const enrollments = await Enrollment.find({
      course: courseId
    })
      .populate("student", "name email role")
      .select("student progress enrolledAt");

    res.status(200).json({
      course: {
        _id: course._id,
        title: course.title
      },
      totalStudents: enrollments.length,
      enrolledStudents: enrollments
    });
  } catch (error) {
    console.error("Fetch Enrolled Students Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});
//student progress for all the courses using populate
app.get("/api/students/:studentId/course-progress", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "student"
    }).select("name email");

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const enrollments = await Enrollment.find({
      student: studentId
    })
      .populate({
        path: "course",
        select: "title description instructor",
        populate: {
          path: "instructor",
          select: "name email role"
        }
      })
      .select("course progress enrolledAt");

    res.status(200).json({
      student,
      totalCourses: enrollments.length,
      courseProgress: enrollments
    });
  } catch (error) {
    console.error("Student Course Progress Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

//compare populate and separate
//populate
app.get("/api/performance/populate/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const start = performance.now();

    const enrollments = await Enrollment.find({
      student: studentId
    })
      .populate({
        path: "course",
        select: "title description instructor",
        populate: {
          path: "instructor",
          select: "name email"
        }
      })
      .lean();

    const executionTime = performance.now() - start;

    res.status(200).json({
      method: "populate",
      totalCourses: enrollments.length,
      executionTimeMs: Number(executionTime.toFixed(2)),
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

//separate
app.get("/api/performance/separate/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const start = performance.now();

    const enrollments = await Enrollment.find({
      student: studentId
    }).lean();

    const courseIds = enrollments.map(e => e.course);

    const courses = await Course.find({
      _id: { $in: courseIds }
    }).select("title description instructor").lean();

    const instructorIds = [
      ...new Set(
        courses
          .map(c => c.instructor?.toString())
          .filter(Boolean)
      )
    ];

    const instructors = await User.find({
      _id: { $in: instructorIds }
    }).select("name email").lean();

    const courseMap = new Map(
      courses.map(course => [
        course._id.toString(),
        course
      ])
    );

    const instructorMap = new Map(
      instructors.map(instructor => [
        instructor._id.toString(),
        instructor
      ])
    );

    const result = enrollments.map(enrollment => {
      const course = courseMap.get(enrollment.course.toString());

      return {
        ...enrollment,
        course: course
          ? {
              ...course,
              instructor: course.instructor
                ? instructorMap.get(course.instructor.toString()) || null
                : null
            }
          : null
      };
    });

    const executionTime = performance.now() - start;

    res.status(200).json({
      method: "separate queries",
      totalCourses: result.length,
      executionTimeMs: Number(executionTime.toFixed(2)),
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

//cascading update 
app.put("/api/courses/:courseId/instructor", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { instructorId } = req.body;

    if (
      !mongoose.isValidObjectId(courseId) ||
      !mongoose.isValidObjectId(instructorId)
    ) {
      return res.status(400).json({
        message: "Invalid course ID or instructor ID"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const instructor = await User.findOne({
      _id: instructorId,
      role: "instructor"
    });

    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found"
      });
    }

    const oldInstructor = course.instructor;

    course.instructor = instructorId;
    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate("instructor", "name email role");

    res.status(200).json({
      message: "Course instructor updated successfully",
      oldInstructor,
      updatedCourse
    });

  } catch (error) {
    console.error("Cascade Update Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

//shallow population
app.get("/api/enrollments/shallow", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("course", "title description")
      .populate("student", "name email")
      .lean();

    res.status(200).json({
      type: "Shallow Population",
      total: enrollments.length,
      enrollments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//deep population
app.get("/api/enrollments/deep", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate({
        path: "course",
        select: "title description instructor",
        populate: {
          path: "instructor",
          select: "name email role"
        }
      })
      .lean();

    res.status(200).json({
      type: "Deep Population",
      total: enrollments.length,
      enrollments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//retrieve both embedded and referrenced lessosns
app.get("/api/courses/:courseId/full-details", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId)
      .populate("instructor", "name email")
      .populate({
        path: "enrollments",
        select: "student progress enrolledAt",
        populate: {
          path: "student",
          select: "name email"
        }
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//phase7:using seed to insert data
app.post("/api/phase7/seed-large-dataset", async (req, res) => {
  try {
    const instructor = await User.findOne({ role: "instructor" });

    if (!instructor) {
      return res.status(400).json({
        message: "Create an instructor before inserting courses"
      });
    }

    const batchId = Date.now().toString();
    const today = new Date().toISOString().slice(0, 10);

    const students = Array.from({ length: 1000 }, (_, i) => ({
      name: `Phase7_Student_${i + 1}`,
      email: `phase7_${batchId}_student${i + 1}@example.com`,
      role: "student",
      isActive: true,
      addedDate: today
    }));

    const studentResult = await User.insertMany(students);
const categories = [
  "JavaScript",
  "MongoDB",
  "Node.js",
  "Express",
  "React"
];

const courses = Array.from({ length: 50 }, (_, i) => ({
  title: `Phase7_${batchId}_Course_${i + 1}`,
  description: `Test course ${i + 1} for scaling performance`,
  category: categories[i % categories.length],
  instructor: instructor._id,
  lessons: []
}));

    const courseResult = await Course.insertMany(courses);

    res.status(201).json({
      message: "Large dataset inserted successfully",
      studentsInserted: studentResult.length,
      coursesInserted: courseResult.length
    });

  } catch (error) {
    console.error("Dataset Insertion Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});