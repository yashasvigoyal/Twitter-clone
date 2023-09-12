const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protectedRoute = require("../protectedResource");



const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const { JWT_SECRET } = require('../config');
router.post("/api/auth/register" ,(req,res)=>{
    const{name,userName,email,password,profileImg,location,dateofBirth,followers,following} = req.body;
    if(!name || !userName || !email || !password){
        return res.status(400).json({error: "One or more mandatory fields are empty"});
    }
 


    UserModel.findOne({email:email})
     .then((userInDB)=>{
       if(userInDB){
         return res.status(500).json({error:"User with this email already registered"});
    }
       bcryptjs.hash(password,16)
         .then((hashedPassword)=>{
           const user = new UserModel({name,userName,email,password:hashedPassword,profileImg,location,dateofBirth,followers,following});
           user.save()
             .then((user)=>{
                res.status(201).json({result:"User signed up successfully!"});
              })
              .catch((err)=>{
                 console.log(err);
               })

          }).catch((err)=>{
              console.log(err);
          })
      }).catch((err)=>{
           console.log(err);
      })
});


router.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id, "email": userInDB.email, "name": userInDB.name };
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid Credentials" });
                    }
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

router.get("/api/user/:id",async(req,res)=>{
    const user = await UserModel.findById(req.params.id)   
   .populate('name','-password')
    .populate('userName','-password')
    .populate('email','-password')
    .populate('location','-password')
    .populate('profileImg','-password')
    .populate('dateofBirth','-password')
    .populate('following','-password')
    .populate('followers','-password')
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ user });
    

    

});

router.put("/api/user/:id/follow",protectedRoute, (req,res)=>{
    UserModel.findByIdAndUpdate(req.params.id, {
        $push: { following: req.user._id },
        $push: {followers:req.params._id}
    }, {
        new: true //returns updated record
    }).populate("userName", "_id name")
        .exec((error, success) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                return res.status(200).json({success:true});
            }
        })
});

router.put("api/user/:id/unfollow",protectedRoute,(req,res)=>{
    UserModel.findByIdAndUpdate(req.params.id,{
        $pull: { following: req.user._id },
        $pull:{followers:req.params._id}
    }, {
        new: true //returns updated record
    }).populate("userName", "_id name")
        .exec((error, success) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                return res.status(200).json({success:true});
            }
        })
});

router.put("/api/user/:id",protectedRoute,(req,res)=>{
    const userId = req.params.id;
    const { name, dateofBirth, location } = req.body;
    
    UserModel.findById(userId, (err, user) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }
        user.name = name;
        user.dateofBirth = dateofBirth;
        user.location = location;
    
        // Save updated user in DB
        user.save((err, updatedUser) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(updatedUser);
        });
      });
    });

    


   








    















module.exports = router;