const jwt = require('jsonwebtoken');
const User = require("../models/User")

exports.authenticate = async(req, res, next) =>{
    try{
        let {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                message:"Please login first...!"
            })
        }

        const dCoded = await jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(dCoded._id);
        if(!user){
            return res.status(401).json({
                message:"User not found...!"
            })
        }
        req.user = user;
        // console.log("This is decoded :- " + dCoded);
        // console.log("The user is : " + user);
        next();
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}