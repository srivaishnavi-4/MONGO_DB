const mongoose=require("mongoose");
const lessonSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },content:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true,
        validate:{
            validator:function(value){
                return value>0;
            },
            message:"Duration must be greater than 0"
        }
    }
},
{
    timestamps:true
}
);
module.exports=mongoose.model("Lesson",lessonSchema);