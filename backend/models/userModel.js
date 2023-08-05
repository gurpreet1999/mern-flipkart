const mongoose=require("mongoose")
const validator=require("validator")
const cryptoo=require("crypto")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"name cannot exceed 30 character"],
        minLength:[4,"name should have more than 4 character"]

    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
      },
      avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },  role: {
        type: String,
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,    
})

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next()
    }

    this.password=await bcryptjs.hash(this.password,10)
})


userSchema.methods.comparePassword=async function(password){

return await bcryptjs.compare(password,this.password)

}

userSchema.methods.getJWTToken=function(){
return jwt.sign({id:this._id},"abcde",{expiresIn:'15d'})
}


userSchema.methods.getPasswordResetToken=function(){

   const resetToken=cryptoo.randomBytes(20).toString("hex")

    this.resetPasswordToken=cryptoo.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire=Date.now() + 15*60*1000
    return resetToken
}

const USER=mongoose.model("USER" , userSchema)

module.exports=USER