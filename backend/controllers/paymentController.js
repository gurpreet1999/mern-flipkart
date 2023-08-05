const stripe=require("stripe")('sk_test_51NSBavSBQIQSCFWjNC67E4vIZ5sYLknMulvVXZzZ0F5ErtklB9eKCjRGPeYel6eLHK9gimmBvQmHezenweC3TdMl005uzgGSiW');

exports.processPayment = async (req, res, next) => {
   

   

    try{
        const myPayment=await stripe.paymentIntents.create({

            amount:req.body.amount,
            currency:"inr",
            metadata:{
                company:"eccomerce"
            
            }
            
            })
            
            console.log(myPayment.client_secret)
            
            
            res.status(200).json({success:true,client_secret:myPayment.client_secret
            })
    }
    catch(err){
        console.log(err)
    }



}

exports.sendStripeApiKey = async (req, res, next) => {

    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY});
  };