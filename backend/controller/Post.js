const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");

exports.createPost = async(req, res) =>{
    try {
        const user = req.user; // the user, owner of the new post..!

        const {image, caption} = req.body; //  getting the data to post !
        if(!image){
            return res.status(400).json({
                message:"Post can't be empty...!"
            })
        }
        const newCloud = await cloudinary.v2.uploader.upload(image, {folder:"FunMedia_Posts"}); // uploading in cloudinary...

        // handling the date for "createdAt" value...
        let time = new Date(Date.now());
        const createDate = time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();

        //  creating the object "Post"
        const newPost = await Post.create({
            image:{
                url:newCloud.secure_url,
                public_id:newCloud.public_id
            },
            caption:caption,
            likes:[],
            comments:[],
            owner:user._id,
            createdAt:createDate
        })

        user.posts.push(newPost._id); // pushed to the "posts" of User
        await user.save(); //  saving the user in DB ...

        res.status(201).json({
            message:"new post added...!",
            newPost
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.deletePost = async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id); // getting post
        const user = await User.findById(req.user._id); // getting the post to delete

        if(!post){
            return res.status(404).json({
                message:"post not found...!"
            })
        }
        //  if it's not user's post...
        if(post.owner.toString() != user._id.toString()){
            return res.status(401).json({
                message:"Post can't be deleted...!"
            })
        }
            //  deleting the post from the user's posts array... 
        let ind = user.posts.indexOf(req.params.id);
        user.posts.splice(ind, 1);
        await user.save(); // saving the user..

        const allUsers = await User.find();
        //  we've to delete it from the "saved" section of all the users...
        for(let i = 0; i < allUsers.length; i++){
            let ind = allUsers[i].saved.indexOf(post._id);
            if(ind != -1){
                allUsers[i].saved.splice(ind, 1);
                await allUsers[i].save();
            }
        }

        await post.remove(); // finally removed from DB

        res.status(201).json({
            message:"post deleted...!"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.editPost = async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id); //  the post
        const {caption} = req.body; //  getting the new caption..

        if(!post || post.owner != req.user._id.toString()){ //  if the owner is not the user...
            return res.status(404).json({
                message:"Post not found...!"
            })
        }

        post.caption = caption; // updated..
        await post.save(); //  saved..

        res.status(200).json({
            message:"Post is updated...!"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.likePost = async(req, res) =>{
    try{
        const post = await Post.findById(req.params.id); // like..
        if(!post){
            return res.status(404).json({
                message:"Post not found...!"
            })
        }

        let index = post.likes.indexOf(req.user._id);
        let msg = "post liked...!";

        if(index == -1){ //  if not liked till
            post.likes.push(req.user._id);
        }
        else{  //  already liked......
            post.likes.splice(index, 1);
            msg = "post liked removed...!"
        }
        await post.save(); // saving the post

        res.status(200).json({
            message:msg
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.saveUnsavePost = async(req, res) =>{
    try{
        const post = await Post.findById(req.params.id); // getting the post..
        if(!post){
            return res.status(404).json({
                message:"post not found...!"
            })
        }

        let index = req.user.saved.indexOf(post._id);
        let msg = "post is saved...!";

        if(index != -1){ // if not saved yet...
            req.user.saved.splice(index, 1);
            msg = "post removed from saved...!"
        }
        else{ //  already saved the post
            req.user.saved.push(post._id);
        }
        await req.user.save(); // saving the user..
        res.status(200).json({
            message:msg
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.commentOnPost = async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id); // getting the post..
        if(!post){
            return res.status(404).json({
                message:"Post not found...!"
            })
        }

        const {comment} = req.body; // the comment to add...
        if(!comment)
            return res.status(400).json({
                message:"Comment can't be empty...!"
            })

        // comment added...
        post.comments.push({
            comment:comment,
            user:req.user._id,
            id:post.commentId++
        })

        await post.save(); //  saving the post

        res.status(201).json({
            message:"comment added on post...!"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.deleteComment = async(req, res) =>{
    try {
        const {commentid} = req.body; //  THE COMMENT ID TO DELETE
        if(commentid == null){ //  not Found..!
            return res.status(400).json({
                message:"Comment is not defined...!"
            })
        }
        
        const post = await Post.findById(req.params.id);  //   getting the post where the comment is, by "params.id"
        if(!post) return res.status(404).json({
            message:"post not found...!"
        })

        let comment, ind = -1;
        for(let i = 0; i < post.comments.length; i++){
            if(post.comments[i].id == commentid){  //  finding the particular comment int the post
                comment = post.comments[i];
                ind = i;
                break;
            }
        }
        if(ind == -1){  //  comment id not found..
            return res.status(404).json({
                message:"Comment not found...!"
            })
        }
// checking the possibility to delete - the user is the comment owner  ||  the user is the owner of the post
        if(comment.user.toString() == req.user._id.toString() || post.owner.toString() == req.user._id.toString()){
            post.comments.splice(ind, 1); //  removed..
            await post.save(); //  saved the post
        }
        else{  //  not possible !
            return res.json(400).json({
                message:"Comment can't be deleted...!"
            })
        }

        res.status(200).json({
            message:"Comment removed...!"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.getAllPosts = async(req, res) =>{
    try{
        const user = await User.findById(req.user._id).populate("followings");  //  getting the logged in user...

        //  alternate way...
        // let allPosts = await Post.find({
        //     owner: {
        //       $in: user.followings,
        //     },
        //   }).populate("owner likes comments.user");

        let allPosts = [];  //  to store the posts...
        for(let i = 0; i < user.posts.length; i++){ //  getting the posts of current user...
            const p = await Post.findById(user.posts[i]).populate("owner likes comments.user");
            allPosts.push(p);
        }
        //   getting the posts of followings of current user...
        for(let i = 0; i < user.followings.length; i++){
            for(let j = 0; j < user.followings[i].posts.length; j++){
                const p = await Post.findById(user.followings[i].posts[j]).populate("owner likes comments.user");
                allPosts.push(p);  //  adding the post to that array...
            }
        }
        //  sorting the array randomly...
        allPosts.sort((a,b) =>{
            return Math.random() - 0.6;
        })
        
        //  retunred as Json..
        res.status(200).json({
            message:"All posts fetched...!",
            allPosts
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}