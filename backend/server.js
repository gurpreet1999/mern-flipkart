const app = require("./app");
const cloudinary=require("cloudinary")
const databaseConnection = require("./config/dbConnection");



cloudinary.v2.config({
    cloud_name:"gurpreetcloud",
    api_key:"994636538226325",
    api_secret:"40Ei7-gvQpa8Wm8PK4kh0pwnKiE"
})


databaseConnection()

const server=app.listen(5000,(req,res)=>{
console.log("server is running is fine")
})