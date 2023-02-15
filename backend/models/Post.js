const mongoose = require("mongoose");

const Post = new mongoose.Schema({
    image:{
        url:String,
        public_id:String,
        // required:true
    },
    caption:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:String,
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            id:Number,
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            comment:String
        }
    ],
    commentId:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model("Post", Post)