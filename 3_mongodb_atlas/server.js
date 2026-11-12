require("dotenv").config();

const mongoose=require("mongoose");
const readline=require("readline");
const User=require("./models/User");

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});
function ask(question){
    return new Promise(resolve=>{
        rl.question(question,resolve);
    });
}

async function registerUser(){
    try{
        const name=await ask("Enter name:");
        const email=await ask("Enter email :");
        const age=Number(await ask("Enter age : "));
        const city=await ask("Enter city:");
        const user=await User.create({
            name,email,age,city
        });
        console.log("\nUser saved successfully");
        console.log(user);

    }catch(error){
        if(errror.code===11000){
            console.log("Error:Email already exists");
        }else{
            console.log("Error:",error.message);
        }
    }
}

async function start(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas connected successfully");
        let choice;
        do{
            await registerUser();
            choice=await ask("\n Do you want add another user? (yes/no):");

        }while(choice.toLowerCase()==="yes");
    }catch(error){
        console.log("Connection error:",error.message);
    }
    finally{
        rl.close();
        console.log("MongoDB connection closed");
    }

}
start();