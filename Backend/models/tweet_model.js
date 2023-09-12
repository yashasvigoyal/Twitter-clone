const mongoose  = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
//const timeZone = require('mongoose-timezone');
const TweetSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    tweetedBy:{
        type:ObjectId,
        ref:"UserModel"

    },
    likes:[
        {
            type: ObjectId,
            ref: "UserModel"
        }
    ],
    comments:[{
        text: {type: String},
        commentedBy: { type: ObjectId, ref: "UserModel"},
        commentedAt: { type: Date }
    }


    ],
    retweetedBy:[
        {
        type:ObjectId,
        ref:"UserModel"
        }
    ],
    image:{
        type:String,
        default: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    replies:[
        {
            type:ObjectId,
            ref:"tweetModel"
        }
    ]
},
{
    timestamps:true
}


);

//userSchema.plugin(timeZone, { paths: ['timestamps','views.createdOn'] });
mongoose.model("TweetModel",TweetSchema);


    

    

    