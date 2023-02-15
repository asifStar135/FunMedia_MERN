const express = require("express");
const { createPost, likePost, commentOnPost, saveUnsavePost, deleteComment, editPost, getAllPosts, deletePost } = require("../controller/Post");
const {authenticate} = require("../middleware/authenticate")


const Router = express.Router();

Router.route("/newPost").post(authenticate, createPost);
Router.route("/like/:id").put(authenticate, likePost);
Router.route("/save/:id").put(authenticate, saveUnsavePost);
Router.route("/post/:id").delete(authenticate, deletePost);
Router.route("/comment/:id").post(authenticate, commentOnPost);
Router.route("/comment/:id").delete(authenticate, deleteComment);
Router.route("/post/edit/:id").put(authenticate, editPost);
Router.route("/allPosts").get(authenticate, getAllPosts);

module.exports = Router