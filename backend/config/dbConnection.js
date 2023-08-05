const mongoose=require("mongoose")


const databaseConnection=()=>{
    mongoose.connect("mongodb+srv://gurpreetsingh:Shalu%401999@cluster0.apn6ahn.mongodb.net/?retryWrites=true&w=majority").then((res)=>{
console.log("mongoDb is connected")
    })
}

module.exports=databaseConnection