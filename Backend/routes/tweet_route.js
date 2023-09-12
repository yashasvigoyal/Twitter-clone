const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protectedRoute = require("../protectedResource");
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const TweetModel = mongoose.model("TweetModel");
const { JWT_SECRET } = require('../config');
router.get("/api/user/:id/tweets",(req,res)=>{
    TweetModel.findById(req.params.id)
        .populate("userName", "_id name profileImg")
        .populate("comments.commentedBy", "_id name")
        .then((dbTweets) => {
            res.status(200).json({ tweets: dbTweets })
        })
        .catch((error) => {
            console.log(error);
        })
});

router.post("/api/tweet", protectedRoute, (req, res) => {
    const { content,image } = req.body;
    if (!content&&!image) {
        return res.status(400).json({ error: "There is nothing to tweet" });
    }
    req.user.password = undefined;
    const tweetObj = new TweetModel({ content: content,likes,comments,retweetedBy,image:image,replies,tweetedBy: req.user });
    tweetObj.save()
        .then((newTweet) => {
            res.status(201).json({ tweet: newTweet });
        })
        .catch((error) => {
            console.log(error);
        })
});

router.put("/api/tweet/:id/like", protectedRoute, (req, res) => {
    TweetModel.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.params._id }
    }, {
        new: true //returns updated record
    }).populate("tweetedBy", "_id")
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});

router.put("/api/tweet/:id/dislike", protectedRoute, (req, res) => {
    TweetModel.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.params._id }
    }, {
        new: true //returns updated record
    }).populate("tweetedBy", "_id")
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});

router.post("/api/tweet/:id/reply", protectedRoute, (req, res) => {

    const reply = { replies: req.body.replies, tweetedBy: req.user._id }

    TweetModel.findByIdAndUpdate(req.params.id, {
        $push: { replies: reply }
    }, {
        new: true //returns updated record
    }).populate("comments.commentedBy", "_id fullName") //comment owner
        .populate("author", "_id fullName")// post owner
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});
app.post('/tweets/reply/:tweetId', (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const tweetedBy = req.user._id;
  
    // Create a new tweet with the provided content and tweetedBy
    const newTweet = new Tweet({ content, tweetedBy });
  
    // Save the new tweet to the database
    newTweet.save()
      .then(savedTweet => {
        // Find the parent tweet and add the new tweet's ID to its `replies` array
        Tweet.findByIdAndUpdate(tweetId, { $push: { replies: savedTweet._id } })
          .then(() => {
            res.status(200).send({ message: 'Reply successfully posted!' });
          })
          .catch(error => {
            console.log(error);
            res.status(500).send({ message: 'An error occurred while updating the parent tweet.' });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while saving the new tweet.' });
      });
  });






module.exports = router;



