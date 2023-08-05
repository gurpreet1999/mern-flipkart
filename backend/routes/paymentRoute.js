const { processPayment, sendStripeApiKey } = require("../controllers/paymentController")
const { isAuthenticatedUser } = require("../middleware/auth")

const paymentRouter=require("express").Router()




paymentRouter.route("/payment/process").post(isAuthenticatedUser,processPayment)
paymentRouter.route("/stripeapikey").get(isAuthenticatedUser,sendStripeApiKey)







module.exports=paymentRouter