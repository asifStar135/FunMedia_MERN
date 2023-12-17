const express = require("express");
const { register, login, logout, findUser, updateUser, getAllUsers, deleteUser, followUnfollow, loadUser } = require("../controller/User");
const {authenticate} = require("../middleware/authenticate");

const Router = express.Router();

//   here all the routes are added where the API requests will be called for User Operations...

Router.route("/account/register").post(register);
Router.route("/account/login").post(login);
Router.route("/account/logout").put(authenticate, logout);
Router.route("/account").get(authenticate, loadUser);
Router.route("/user/:id").get(authenticate, findUser);
Router.route("/account/update").put(authenticate ,updateUser);
Router.route("/allUsers").get(authenticate,getAllUsers);
Router.route("/account").delete(authenticate ,deleteUser);
Router.route("/user/:id").put(authenticate ,followUnfollow);

module.exports = Router;