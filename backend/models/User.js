const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//  declaration of the object "User" and all it's properties... along with conditions...

const User = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        url:String,
        public_id:String
    },
    userName:{
        type:String,
        unique:[true, "userName already taken...!"],
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false,
        minLength:[6, "password should be more than 5 characters"]
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    followings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    saved:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    joinDate:{
        type:String,
        required:true
    }
})

User.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

User.methods.generateToken = async function(){
    return await jwt.sign({_id:this._id}, process.env.SECRET_KEY);
}

User.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("User", User);