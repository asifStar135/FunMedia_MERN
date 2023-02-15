const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");

exports.createPost = async(req, res) =>{
    try {
        const user = req.user;

        const {image, caption} = req.body;
        if(!image){
            return res.status(400).json({
                message:"Post can't be empty...!"
            })
        }
        const newCloud = await cloudinary.v2.uploader.upload(image, {folder:"FunMedia_Posts"})

        let time = new Date(Date.now());
        const createDate = time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();

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

        user.posts.push(newPost._id);
        await user.save();

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
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if(!post){
            return res.status(404).json({
                message:"post not found...!"
            })
        }
        if(post.owner.toString() != user._id.toString()){
            return res.status(401).json({
                message:"Post can't be deleted...!"
            })
        }

        let ind = user.posts.indexOf(req.params.id);
        user.posts.splice(ind, 1);
        await user.save();

        const allUsers = await User.find();

        for(let i = 0; i < allUsers.length; i++){
            let ind = allUsers[i].saved.indexOf(post._id);
            if(ind != -1){
                allUsers[i].saved.splice(ind, 1);
                await allUsers[i].save();
            }
        }

        await post.remove();
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
        const post = await Post.findById(req.params.id);
        const {caption} = req.body;

        if(!post || post.owner != req.user._id.toString()){
            return res.status(404).json({
                message:"Post not found...!"
            })
        }

        post.caption = caption;
        await post.save();

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
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message:"Post not found...!"
            })
        }

        let index = post.likes.indexOf(req.user._id);
        let msg = "post liked...!";
        if(index == -1){
            post.likes.push(req.user._id);
        }
        else{
            post.likes.splice(index, 1);
            msg = "post liked removed...!"
        }
        post.save();

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
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message:"post not found...!"
            })
        }

        let index = req.user.saved.indexOf(post._id);
        let msg = "post is saved...!";

        if(index != -1){
            req.user.saved.splice(index, 1);
            msg = "post removed from saved...!"
        }
        else{
            req.user.saved.push(post._id);
        }
        req.user.save();
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
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message:"Post not found...!"
            })
        }

        const {comment} = req.body;
        if(!comment)
            return res.status(400).json({
                message:"Comment can't be empty...!"
            })

        post.comments.push({
            comment:comment,
            user:req.user._id,
            id:post.commentId++
        })

        post.save();

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
        const {commentid} = req.body;
        if(commentid == null){
            return res.status(400).json({
                message:"Comment is not defined...!"
            })
        }
        
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({
            message:"post not found...!"
        })

        let comment, ind = -1;
        for(let i = 0; i < post.comments.length; i++){
            if(post.comments[i].id == commentid){
                comment = post.comments[i];
                ind = i;
                break;
            }
        }
        if(ind == -1){
            return res.status(404).json({
                message:"Comment not found...!"
            })
        }

        if(comment.user.toString() == req.user._id.toString() || post.owner.toString() == req.user._id.toString()){
            post.comments.splice(ind, 1);
            await post.save();
        }
        else{
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
        const user = await User.findById(req.user._id).populate("followings");

        // let allPosts = await Post.find({
        //     owner: {
        //       $in: user.followings,
        //     },
        //   }).populate("owner likes comments.user");

        let allPosts = [];

        for(let i = 0; i < user.posts.length; i++){
            const p = await Post.findById(user.posts[i]).populate("owner likes comments.user");
            allPosts.push(p);
        }

        for(let i = 0; i < user.followings.length; i++){
            for(let j = 0; j < user.followings[i].posts.length; j++){
                const p = await Post.findById(user.followings[i].posts[j]).populate("owner likes comments.user");
                allPosts.push(p);
            }
        }

        allPosts.sort((a,b) =>{
            return Math.random() - 0.6;
        })

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