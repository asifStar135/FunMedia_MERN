const App = require("./app");
const express = require("express")
const { connectDb } = require("./config/db");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser")


App.use(express.json({limit:"50mb"}));
App.use(express.urlencoded({limit:"50mb", extended:true}))
App.use(cookieParser());


cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_SECRET_KEY
})

connectDb();

App.use(require("./routes/User"));
App.use(require("./routes/Post"));

App.listen(process.env.PORT, () =>{
    console.log(`Backend is running at port ${process.env.PORT}`)
})