const mongoose = require("mongoose");
const embeddedLessonSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true,
        validate:{
            validator:value=>value>0,
            message:"Duration must be greater than 0"
        }
    }
});
const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    //Embedded Lessons
    lessons:[embeddedLessonSchema],
    //Referenced Lessons
    referencedLessons:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lesson"
    }],
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5
    }},
    {
        timestamps:true});

        //Instance method :total course duration
        courseSchema.methods.calculateDuration=async function(){
            let embeddedTotal=this.lessons.reduce((total,lesson)=>total+lesson.duration,0);
            const referenced=await mongoose.model("Lesson").find({_id:{$in:this.referencedLessons}});
            const referencedTotal=referenced.reduce((total,lesson)=>total+lesson.duration,0);
            return embeddedTotal+referencedTotal;
        };

        //static method:fetch courses by category
        courseSchema.statics.findByCategory=function(category){
            return this.find({category});
        };

        //static method:fetch top-rated courses
        courseSchema.statics.getTopRated=function(){
            return this.find({rating:{$gte:4}}).sort({rating:-1});
        };

        //Post-save hook
        courseSchema.post("save",function(doc){
            console.log("New course created:",doc.title);
        });

        //virtual field
        courseSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "course"
});

courseSchema.virtual("completionPercentage").get(function () {
  if (!this.enrollments || this.enrollments.length === 0) {
    return 0;
  }

  const totalProgress = this.enrollments.reduce(
    (total, enrollment) => total + enrollment.progress,
    0
  );

  return Number(
    (totalProgress / this.enrollments.length).toFixed(2)
  );
});

        module.exports=mongoose.model("Course",courseSchema);