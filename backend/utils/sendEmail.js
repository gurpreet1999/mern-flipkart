const nodeMailer=require("nodemailer");


const sendMail=async(options)=>{

    const transporter=nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure: true,
        service:"gmail",
        auth:{
            user:"gurpreetsingh983296@gmail.com",
            pass:"kxqejdfesmguxehl"
        }
    })
    const mailOptions={
        from:"gurpreetsingh983296@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
        
        }
        await transporter.sendMail(mailOptions)

}


module.exports=sendMail
