const mongoose = require("mongoose")
// FUNCTION TO CONNECT THE MONGODB SERVER...

exports.connectDb = async ()=>{
    try {
        mongoose.set('strictQuery', true);
        let {connection} = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Databade is Connected...! => ${connection.host}`);
    } catch (error) {
        console.log(error);
    }
}