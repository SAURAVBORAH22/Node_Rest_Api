//calling router
const router = require('express').Router();

//calling User
const User = require('../models/User');

//calling brcypt
const bcrypt = require('bcrypt');

//Register routes
router.post('/register', async (req, res) => {
    //try and catch block
    try {
        //generate new password
        //generrating a salt
        const salt = await bcrypt.genSalt(10); //10 is the cost factor

        //hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, salt); //passing the password and salt to bcrypt

        //creating a newUser
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });


        //save user and return response
        const user = await newUser.save();
        //status code
        res.status(200).json(user);
    } catch (err) {
        //sending error as response
        res.status(500).json(err);
    }
});


//Login routes
router.post('/login', async (req, res) => {
    //try and catch block
    try{
    //finding the user
    const user = await User.findOne({email: req.body.email});
    //if no user like that
    !user && res.status(404).json("user not found")

    //checking correct password
    const validPassword = await bcrypt.compare(req.body.password, user.password);//passing the password and salt to bcrypt

    //if password is incorrect
    !validPassword && res.status(400).json("wrong password");
    
    //if valid email and password
    res.status(200).json(user);

    } catch (err) {
        //sending error as response
        res.status(500).json(err);
    }
});

//exporting router
module.exports = router;