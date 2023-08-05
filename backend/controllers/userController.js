const USER = require("../models/userModel");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const crypto=require("crypto");
const getDataUri = require("../utils/dataUri");

const sendEmail=require("../utils/sendEmail")

const registerUser=async(req,res,next)=>{


try{

  const file=req.file
  const { name, email, password } = req.body;

  console.log(name,email,password)
  console.log(file)
 
let fileuri;


     fileuri=getDataUri(file)
    
  



  const myCloud = await cloudinary.v2.uploader.upload(fileuri.content, {
    folder:"avatars",
    width: 150,
    crop: "scale",
  });



  const user = await USER.create({
      name,
      email,
      password,
      avatar: {
        public_id:myCloud.public_id,
        url: myCloud.secure_url
      },
    });

    sendToken(user,201,res)


}
catch(err){
  console.log(err)
}
}


const loginUser=async(req,res,next)=>{

    const { email, password } = req.body;
console.log(email,password)
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
      }
    
      const user = await USER.findOne({ email }).select("+password");
    
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }

      console.log("hhhhhh yaha par he")
      sendToken(user, 200, res);

}

const logout=async(req,res,next)=>{

res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
})
res.status(200).json({
    success: true,
    message: "Logged Out",
  })

}

const forgotPassword=async(req,res,next)=>{

  console.log("hello")
 const user = await USER.findOne({ email: req.body.email });
 console.log(user)
 if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // BECAUSE WOH WALA METHOD ME HUM RESETTOKEN SAVE KR RAHE HE DOCUMEMT ME SO WE ALSO HAVE TO SAVE

  const resetPasswordUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }

}


const resetPassword=async(req,res,next)=>{

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user=await USER.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(
            new ErrorHandler(
              "Reset Password Token is invalid or has been expired",
              400
            )
          );
    }


console.log(user)

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
      }
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
    
      await user.save();
      sendToken(user, 200, res);

}



const getUserDetail=async(req,res,next)=>{
    
  const user = await USER.findById(req.user._id);
  console.log(user)

  if(!user){
    console.log("hh")
    console.log(user)
    return next(new ErrorHandler("login first to acccess ", 400))
  }
  res.status(200).json({
    success: true,
    user,
  });



}


const updatePassword=async(req,res,next)=>{
 const {oldPassword,newPassword,confirmPassword}=req.body
 console.log(oldPassword,newPassword,confirmPassword)

  const user = await USER.findById(req.user._id).select("+password");
  console.log(user)
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  console.log(isPasswordMatched)

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }


  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);




}


const updateProfile=async(req,res,next)=>{

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  console.log(req.body.file)

  if (!req.body.file===undefined) {
    console.log("hiii")

    const user = await USER.findById(req.user._id);

    const imageId = user.avatar.public_id;
    
    await cloudinary.v2.uploader.destroy(imageId);


 const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  

  const user = await USER.findByIdAndUpdate(req.user._id, newUserData, {
new:true,
runValidators:true,
useFindAndModify: false,
  }
   


  )

  console.log(user)

res.status(200).json({
    success: true,
    user:user
  });
}


//admin routes for user


const getAllUser=async(req,res,next)=>{

  const users = await USER.find();

  res.status(200).json({
    success: true,
    users,
  });


}

const singleUser=async(req,res,next)=>{

  const user = await USER.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });




}


const updateUserRole=async(req,res,next)=>{
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };


  const user=await USER.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false

  })

  res.status(200).json({
    success: true,
  });

}



const deleteUser=async(req,res,next)=>{

  const user = await USER.findById(req.params.id);

  if(!user){
    return next(
      new ErrorHandler(`User does not exist with Id:${req.params.id}`,400)
    );
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);


  await user.remove()

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
}



module.exports={getUserDetail,registerUser,loginUser,forgotPassword,resetPassword,logout,deleteUser,updateUserRole,singleUser,getAllUser,updatePassword,updateProfile}