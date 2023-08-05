const { newOrder, getSingleOrder, myOrder, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController")
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth")

const orderRouter=require("express").Router()


orderRouter.route("/order/new").post(isAuthenticatedUser,newOrder)
orderRouter.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)
orderRouter.route("/orders/me").get(isAuthenticatedUser,myOrder)
orderRouter.route("admin/orders").get(isAuthenticatedUser,getAllOrders)
orderRouter.route("admin/order/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateOrderStatus).delete(isAuthenticatedUser,authorizeRole("admin"),deleteOrder)








module.exports=orderRouter