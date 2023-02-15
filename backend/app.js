const express = require("express")

const App = express();
if(process.env.MODE != "production")
    require("dotenv").config({path:"backend/config/config.env"})

module.exports = App;