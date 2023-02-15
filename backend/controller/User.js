const User = require("../models/User")
const Post = require("../models/Post")
const cloudinary = require("cloudinary")

exports.register = async(req, res) =>{
    try {
        const {name, userName, image, password} = req.body;

        const prevUser = await User.findOne({userName});
        if(prevUser)
            return res.status(401).json({
                message:"userName not available...!"
            })

        let newCloud;
        if(image){
            newCloud = await cloudinary.v2.uploader.upload(image, {
                folder:"FunMedia_Users"
            })
        }
        else{
            newCloud = {
                public_id:"funmedia_users/default_avatar_xlauux",
                url:"https://res.cloudinary.com/dtgj7lwpa/image/upload/v1663670301/funmedia_users/default_avatar_xlauux.png"
            }
        }

        let time = new Date(Date.now());
        const joinDate = time.getDate() + "." + (time.getMonth()+1) + "." + time.getFullYear();

        const user = await User.create({
            name:name,
            userName:userName,
            image:{
                public_id:newCloud.public_id,
                url:newCloud.url
            },
            password:password,
            joinDate:joinDate
        })

        const token = await user.generateToken();
        const options = {
            expires:new Date(Date.now() + 20*24*36*36),
            httpOnly:true
        }

        res.status(200).cookie("token",token, options).json({
            message:"You're signed Up...!",
            user
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.login = async(req, res) =>{
    try {
        const {userName, password} = req.body;

        const user = await User.findOne({userName}).select("+password");

        if(!user)
            return res.status(401).json({
                message:"User not found...!"
            })

        const check = await user.matchPassword(password);
        if(!check)
            return res.status(400).json({
                message:"Wrong password...!"
            })
        
        const token = await user.generateToken();
        const options = {
            expires:new Date(Date.now() + 20*24*60*60*1000),
            httpOnly:true
        }

        res.status(201).cookie("token", token, options).json({
            message:"Logged in...!",
            user
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.loadUser = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id).populate("followers followings");

        res.status(200).json({
            message: "User loaded successfully !",
            user
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.logout = async(req, res) =>{
    try {
        const options = {
            expires: new Date(Date.now()),
            httpOnly: true
        }

        res.status(200).cookie("token", null, options).json({
            message:"Logged out...!"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.updateUser = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id).select("+password");
        const {name, image, password} = req.body;

        if(name){
            user.name = name;
        }
        if(password) {
            user.password = password;
        }
        if(image){
            if(user.image.public_id != "funmedia_users/default_avatar_xlauux"){
                await cloudinary.v2.uploader.destroy(user.image.public_id);
            }
            const newCloud = await cloudinary.v2.uploader.upload(image, {
                folder:"FunMedia_Users"
            })
            user.image = {
                url:newCloud.secure_url,
                public_id:newCloud.public_id
            }
        }

        await user.save();

        res.status(200).json({
            message:"details updated...!"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.findUser = async(req, res) =>{
    try {
        const foundUser = await User.findById(req.params.id).populate("followers followings posts posts.owner");
        // console.log("user is",foundUser);

        if(foundUser == null){
            return res.status(401).json({
                message:"User not found...!"
            })
        }

        const allPosts = await Post.find().populate("likes comments.user");

        let userPosts =[];
        allPosts.forEach(item =>{
            if(item.owner.toString() == foundUser._id.toString()){
                userPosts.push(item);
            }
        })
        
        foundUser.posts = userPosts;
        res.status(200).json({
            message:"user finded...!",
            foundUser
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.getAllUsers = async(req, res) =>{
    try{
        const allUsers = await User.find();

        allUsers.sort((a, b) => {
            return Math.random() - 0.4;
        })

        res.status(201).json({
            message:"all users fetched...!",
            allUsers
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.deleteUser = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id).select("+password");
        const {password} = req.body;
        
        const match = await user.matchPassword(password);
        if(match == false){
            return res.status(401).json({
                message:"wrong password...!"
            })
        }

        //  handle avatar
        if(user.image.public_id != "funmedia_users/default_avatar_xlauux"){
            await cloudinary.v2.uploader.destroy(user.image.public_id);
        }
        //  deleting posts
        for(let i = 0; i < user.posts.length; i++){
            let post = await Post.findById(user.posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.remove();
        }
        
        const allUsers = await User.find();
        for(let i = 0; i < allUsers.length; i++){ //  loop for every user...
            //  deleting the saved item if that item is current user's post
            for(let j = 0; j < allUsers[i].saved.length; j++){ //  loop for saved items of that user...
                const tempPost = await Post.findById(allUsers[i].saved[j]);
                if(tempPost.owner.toString() == user._id.toString()){
                    allUsers[i].saved.splice(j, 1);
                    j--;
                }
            }

            /// if current user is a follower of allUser[i] ... DELETE IT !!
            let ind = allUsers[i].followers.indexOf(user._id);
            if(ind != -1) allUsers[i].followers.splice(ind, 1);

            /// if allUser[i] is a follower of current user ... DELETE IT !!
            ind = allUsers[i].followings.indexOf(user._id);
            if(ind != -1) allUsers[i].followings.splice(ind, 1);

            await allUsers[i].save();
        }

        const allPosts = await Post.find(); // getting all posts...
        for(let i = 0; i < allPosts.length; i++){
            // deleting the like...
            let ind = allPosts[i].likes.indexOf(user._id);
            if(ind != -1) allPosts[i].likes.splice(ind, 1);
            // deleting the comment...!!
            for(let j = 0; j < allPosts[i].comments.length; j++){
                if(allPosts[i].comments[j].user.toString() == user._id.toString()){
                    allPosts[i].comments.splice(j, 1);
                    j--;
                }
            }

            await allPosts[i].save();
        }
        // making the cookie null...
        const option ={
            expires:new Date(Date.now()),
            httpOnly:true
        }

        await user.remove(); //     FINAL DELETE THE ACCOUNT

        res.status(200).cookie("token", null, option).json({
            message:"user removed...!"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

exports.followUnfollow = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id);
        const targetUser = await User.findById(req.params.id);

        if(!targetUser){
            return res.status(401).json({
                message:"user not found...!"
            })
        }
        let index = targetUser.followers.indexOf(user._id);

        let msg;
        if(index == -1){
            user.followings.push(req.params.id);
            targetUser.followers.push(user._id);
            msg = "user followed...!"
        }
        else{
            targetUser.followers.splice(index, 1);
            index = user.followings.indexOf(req.params.id);
            user.followings.splice(index, 1);            
            msg = "user unfollowed...!"
        }

        await user.save();
        await targetUser.save();

        res.status(201).json({
            message:msg
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}