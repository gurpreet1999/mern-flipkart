const multer=require("multer")

const storage=multer.memoryStorage()

const singleUpload=multer({
    storage:storage
})

module.exports=singleUpload