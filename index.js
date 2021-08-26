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

//imporing postRoute
const postRoute = require("./routes/posts");

//importing multer
//used to upload files
//https://www.npmjs.com/package/multer
const multer = require('multer'); //for file uploads

//adding our path
const path = require('path');


//configuring dot env
dotenv.config();

//connecting to mongoose
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    });


//using the images path
app.use("/images",express.static(path.join(__dirname, "public/images"))); //for images

//middleware
app.use(express.json()); //parse application/json
app.use(helmet()); //secure our app
app.use(morgan("common")); //log requests

//for more info on multer go to 
//https://www.npmjs.com/package/multer

//defining the storage for our uploaded files
const storage = multer.diskStorage({ //store files on disk
    destination: (req, file, cb) => { //destination is where the file will be saved
        cb(null, "public/images"); //the path where the file will be saved
    },
    filename: (req, file, cb) => { //filename is the name of the file
        cb(null, req.body.name); //the name of the file
    },
});

const upload = multer({storage: storage}); //upload files

//post request for uploading single file 
app.post("/api/upload", upload.single("file"), (req, res) => {
    //creating a try and catch block
    try {
        return res.status(200).json("File uploaded successfully.")
    } catch (err) {
        console.log(err); //log the error
    }
});

//using user route
app.use("/api/users", userRoute);
//using auth route
app.use("/api/auth", authRoute);
//using post route
app.use("/api/posts", postRoute);

//making our app listen
//used to listen on port 8800
app.listen(8800, () => {
    console.log('server is running');
});