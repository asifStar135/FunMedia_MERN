const User = require("../models/User") // the schema "User"
const Post = require("../models/Post") // the schema "Post"
const cloudinary = require("cloudinary") // for uploading the images in cloud...

exports.register = async(req, res) =>{
    try {
        const {name, userName, image, password} = req.body; //  getting the data to register...

        const prevUser = await User.findOne({userName}); //  checking if prev user is there with this userName..
        if(prevUser)
            return res.status(401).json({
                message:"userName not available...!"
            })

        let newCloud;  //  handling coudinary 
        if(image){ // custom image..
            newCloud = await cloudinary.v2.uploader.upload(image, {
                folder:"FunMedia_Users"
            })
        }
        else{ // for default image...
            newCloud = {
                public_id:"funmedia_users/default_avatar_xlauux",
                url:"https://res.cloudinary.com/dtgj7lwpa/image/upload/v1663670301/funmedia_users/default_avatar_xlauux.png"
            }
        }
        // handling the date for joinDate property ...
        let time = new Date(Date.now());
        const joinDate = time.getDate() + "." + (time.getMonth()+1) + "." + time.getFullYear();

        //  creating the User object with all the data !!
        const user = await User.create({
            name:name,
            userName:userName,
            image:{
                public_id:newCloud.public_id,
                url:newCloud.url
            },
            password:password,
            joinDate:joinDate
        });

        //  generating the token for user & logging in at the same time..
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
        const {userName, password} = req.body;  //  getting data from request

        const user = await User.findOne({userName}).select("+password");  //  fetching the user with the userName

        if(!user)
            return res.status(401).json({
                message:"User not found...!"
            })

        const check = await user.matchPassword(password); //  matching the password with the function...
        if(!check)
            return res.status(400).json({
                message:"Wrong password...!"
            })
        
        const token = await user.generateToken(); //  generating the token after logging in...
        const options = {
            expires:new Date(Date.now() + 20*24*60*60*1000),
            httpOnly:true
        }
        
        // logging done...
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
        const user = await User.findById(req.user._id).populate("followers followings");  //  fetching the user by id...

        res.status(200).json({ //  sending as Json
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
        // logging out, so token will be null in cookies..
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
        const {name, image, password} = req.body;  //  getting the data for updation...
        const user = await User.findById(req.user._id).select("+password");  ///  fetching the user along with the password

        //  updating details one by one...
        if(name){
            user.name = name;
        }
        if(password) {
            user.password = password;
        }
        if(image){
            //  for default image..
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

        await user.save();  //  saving the user in db after operation..

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
         //  fetching the user with id and populating the objects..
        const foundUser = await User.findById(req.params.id).populate("followers followings posts posts.owner");

        if(foundUser == null){
            return res.status(401).json({
                message:"User not found...!"
            })
        }

        const allPosts = await Post.find().populate("likes comments.user"); //  finding all the posts..

        //  filtering the posts which belong to this user..
        let userPosts =[];
        allPosts.forEach(item =>{
            if(item.owner.toString() == foundUser._id.toString()){
                userPosts.push(item);
            }
        })
        
        foundUser.posts = userPosts; // setting the posts array in thi user's posts attribute..
        res.status(200).json({ //  sent as Json
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
        const allUsers = await User.find(); //  finding all the user in DB
        //  sorting in random order...
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

// most complicated part...! 
exports.deleteUser = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id).select("+password");  //  fetching the user along with selecting the password
        const {password} = req.body; //  we need the password for deletion..
        
        const match = await user.matchPassword(password); // matching
        if(match == false){ //  return as the passwords doesn't match..
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

            await allPosts[i].save(); //  saving the post
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
        const user = await User.findById(req.user._id); // current USer...
        const targetUser = await User.findById(req.params.id); // User to follow-unfollow...

        if(!targetUser){
            return res.status(401).json({
                message:"user not found...!"
            })
        }
        let index = targetUser.followers.indexOf(user._id);

        let msg;
        if(index == -1){ // not followed yet !
            user.followings.push(req.params.id);
            targetUser.followers.push(user._id);
            msg = "user followed...!"
        }
        else{  //  allready followed...
            targetUser.followers.splice(index, 1);
            index = user.followings.indexOf(req.params.id);
            user.followings.splice(index, 1);            
            msg = "user unfollowed...!"
        }
        //  saving both the user..
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