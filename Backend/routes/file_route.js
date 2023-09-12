const express = require('express');
const router = express.Router();
const multer = require("multer");
const protectedRoute = require("../protectedResource");
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }

})

const upload = multer({
    storage:storage,
    limits:{
        fileSize: 1024*1024*1
    },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype=="image/png"||file.mimetype=="image/jpg"||file.mimetype=="image/jpeg"){
            cb(null,true);
        }
        else{
            cb(null,false);
            return res.status(400).json({error:"File tyes allowed are .jpeg,.png ,.jpg"});
        }
    }
})

router.post("/api/user/:id/uploadProfilePic", upload.single('file'), function (req, res) {
    res.json({ "fileName": req.file.filename });
});












module.exports = router;
