const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/SignUp_Login");

//user routes
const user_routes = require("./routes/userRoute");

app.use('/api', user_routes)

app.listen(80, ()=>{
    console.log("Server is ready at port 80")
});
