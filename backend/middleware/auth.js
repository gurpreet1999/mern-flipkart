const jwt=require("jsonwebtoken");
const USER = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

const isAuthenticatedUser=async(req,res,next)=>{

const {token}=req.cookies



if(!token){
    console.log("token")
    return next(new ErrorHandler("Please Login to access this resource", 401));
}

const decodeData=jwt.verify(token,"abcde")

req.user=await USER.findById(decodeData.id)


next()

}


const authorizeRole=(...roles)=>{

    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resouce `,
                403
              )
        }

        next()
    }

  


}

module.exports={authorizeRole,isAuthenticatedUser}
