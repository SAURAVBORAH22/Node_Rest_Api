//calling express
const express = require('express');

//calling our application
const app = express();

//calling mongoose 
//used to connect to our database
const mongoose = require('mongoose');

//calling dotenv
//used to load environment variables from .env file
const dotenv = require('dotenv');

//calling helmet
//helment is used to secure our app
const helmet = require('helmet');

//calling morgan
//used to log requests
const morgan = require('morgan');

//imporing userRoute
const userRoute = require("./routes/users");

//imporing authRoute
const authRoute = require("./routes/auth");


//configuring dot env
dotenv.config();

//connecting to mongoose
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    });


//middleware
app.use(express.json()); //parse application/json
app.use(helmet()); //secure our app
app.use(morgan("common")); //log requests

//using user route
app.use("/api/users",userRoute);
//using auth route
app.use("/api/auth",authRoute);

//making our app listen
//used to listen on port 8800
app.listen(8800, () => {
    console.log('server is running');
});