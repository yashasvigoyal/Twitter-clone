const mongoose  = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
//const timeZone = require('mongoose-timezone');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profileImg:{
        type: String,
        default: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    location:{
        type:String,
        default:null
    },
    dateofBirth:{
        type:Date,
        default:null
    
    },
    followers:[{type:ObjectId,ref:"UserModel"}],
    following:[{type:ObjectId,ref:"UserModel"}],
},
    {
        timestamps:true
    }
);
//userSchema.plugin(timeZone, { paths: ['timestamps','views.createdOn'] });

mongoose.model("UserModel",userSchema);