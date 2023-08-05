const ORDER = require("../models/orderModel");
const PRODUCT = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");



const newOrder=async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
    
console.log( shippingInfo,
  orderItems,
  paymentInfo,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,)

      const order = await ORDER.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
      });

      res.status(201).json({
        success: true,
        order,
      });

}


const getSingleOrder=async(req,res,next)=>{

const order=await ORDER.findById(req.params.id).populate("user" , "name email")
if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  })
}

const myOrder=async(req,res)=>{

    const orders = await ORDER.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
      });



}

//<--admin routes -->//




const getAllOrders=async(req,res,next)=>{

    const orders = await ORDER.find();

    let totalAmount = 0;
  
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });


}

// update Order Status -- Admin


const updateOrderStatus=async(req,res,next)=>{

const order=await ORDER.findById(req.params.id)

if(!order){
    return next(new ErrorHandler("Order not found with this Id", 404));
}
if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }


  if(req.body.status==="Shipped"){

order.orderItems.forEach(async(ord)=>{
await updateStock(o.product, o.quantity); 
})
order.orderStatus = req.body.status;

if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
  }




}


async function updateStock(id, quantity) {
    const product = await PRODUCT.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }

  const deleteOrder=async(req,res,next)=>{

const order=await ORDER.findById(req.params.id)

if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });

  }


  module.exports={deleteOrder,updateOrderStatus,getAllOrders,myOrder,getSingleOrder, newOrder}