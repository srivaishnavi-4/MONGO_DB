const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(value){
                return value.includes("@");
            },
            message:"Email must contain @"
        }
    },
    role:{
        type:String,
        enum:["student","admin","instructor"],
        default:"student"
    }
},
{
    timestamps:true
}
);
module.exports=mongoose.model("User",userSchema);