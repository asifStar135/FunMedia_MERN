const jwt = require('jsonwebtoken');
const User = require("../models/User")

exports.authenticate = async(req, res, next) =>{
    //   Here next is a function which have to called next of this function...
    try{
        let {token} = req.cookies; // token from cookies to verify user..
        if(!token){ //  no token, means not logged in !
            return res.status(401).json({
                message:"Please login first...!"
            })
        }

        const dCoded = await jwt.verify(token, process.env.SECRET_KEY); // token verification for user who's logged in using the secret key

        const user = await User.findById(dCoded._id); //  fetched the user..
        if(!user){
            return res.status(401).json({
                message:"User not found...!"
            })
        }
        req.user = user; //  setting the user of request...
        next();  //  calling the next functions...
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}