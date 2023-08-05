const PRODUCT = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const getDataUri = require("../utils/dataUri");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary=require("cloudinary")




const createProduct=async(req,res,next)=>{

  try{
   

    let images=[];
    
    if(typeof req.images==="string"){
    images.push(req.body.images)
    }else{
        images=req.files
    }

    const imageLink=[]
    for(let i=0;i<images.length;i++){
    
       const fileuri=getDataUri(images[i])

          const result=await cloudinary.v2.uploader.upload(fileuri.content,{
            folder:"avatars"
          })
      
      imageLink.push({
          public_id:result.public_id,
          url:result.secure_url
      })
      
      }
      
    
      req.body.images=imageLink;
      req.body.user=req.user._id;
      
      const product=await PRODUCT.create(req.body)
      
      
      res.status(201).json({
          success: true,
          product,
        });
  }







 catch(err){
console.log(err)
 }




}



const getAllProduct=async(req,res,next)=>{

  const resultPerPage = 8;

  const productsCount = await PRODUCT.countDocuments();

  const apiFeature = new ApiFeatures(PRODUCT.find(), req.query).search().filter();

  let products = await apiFeature.query.clone();

  



  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;
  

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });

}

const getProductDetail=async(req,res,next)=>{

    const product=await PRODUCT.findById(req.params.id)
if(!product){
    return next(new ErrorHandler("Product not found", 404));
}

res.status(200).json({
    success: true,
    product,
  });

}



//-->admin routes --> //

const getAdminProduct=async(req,res,next)=>{
    const products = await PRODUCT.find();

    res.status(200).json({
      success: true,
      products,
    });
}

const updateProduct=async()=>{

    let product = await PRODUCT.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      let images=[];

      if(typeof req.body.images==="string"){
        images.push[req.body.images]
      }
      else{
          images=req.body.images
      }

if(images!==undefined){

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      let imagesLink=[];

      for(let i=0;i<images.length;i++){
      const result=  await cloudinary.v2.uploader.upload(images[i],{
       
      })

imagesLink.push({
    public_id:result.public_id,
    url:result.secret_url
})

      }

      req.body.images = imagesLinks;

  
}


 product=await PRODUCT.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify: false,
 })

 res.status(200).json({
    success: true,
    product,
  });
    
}

const deleteProduct=async()=>{
    const product = await PRODUCT.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      for(let i=0;i<product.images.length;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
      }

      await product.remove()

      res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
      });


}

const getProductReviews=async()=>{
    const product = await PRODUCT.findById(req.query.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
}

const deleteReview=async()=>{

const product=await PRODUCT.findById(req.query.productId)

if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews=product.reviews.filter((rev )=>{
return rev._id.toString()!==req.query.id
  })

  let avg=0;

  reviews.forEach((rev)=>{
    avg+=rev.rating
  })

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await PRODUCT.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews

  },{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })

res.status(200).json({
    success: true,
  });
}

const createPRoductReview=async(req,res,next)=>{

    const { rating, comment, productId } = req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment

    }
    const product = await PRODUCT.findById(productId);
    console.log(product)

    const isReviewed=product.reviews.find((rev)=>{return rev.user.toString()===req.user._id.toString()})

if(isReviewed){
    product.reviews.forEach((rev)=>{
if(rev.user.toString()===req.user._id.toString()){
rev.rating=rating;
rev.comment=comment;
}
    })
    
}else{
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
}

let avg=0;

product.reviews.forEach((rev)=>{
avg+=rev.rating
})

product.rating=avg/product.reviews.length

await product.save({validateBeforeSave: false})
res.status(200).json({
    success: true,
  });

}

module.exports={createProduct,createPRoductReview,deleteReview,getProductReviews,getAllProduct,getProductDetail,deleteProduct,updateProduct,getAdminProduct}