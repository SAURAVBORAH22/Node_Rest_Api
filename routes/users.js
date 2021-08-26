//calling User
const User = require('../models/User');

//calling router
const router = require('express').Router();

//calling bcrypt
const bcrypt = require('bcrypt');

//update users 
//putting id as async param
router.put('/:id', async (req, res) => {
    //checking if userId is equal to logged in user or user is admin
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        //if user tries to update password
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);//getting 10 random salt
                //updating the request
                req.body.password = await bcrypt.hash(req.body.password, salt);//hashing the password
            } catch (err) {
                return res.status(500).json(err);//returning 500 if error
            }
        }

        //updating the actual user
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });//updating the user
            //successful status
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);//returning 500 if error
        }
    }
    //if not 
    else {
        //return error
        return res.status(403).json("You can update only your account!");
    }
});


//deleting user
router.delete('/:id', async (req, res) => {
    //checking if userId is equal to logged in user or user is admin
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        //deleting the user
        try {
            const user = await User.findByIdAndDelete(req.params.id);//deleting the user
            //successful status
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);//returning 500 if error
        }
    }
    //if not 
    else {
        //return error
        return res.status(403).json("You can delete only your account!");
    }
});


//get user
router.get("/", async (req, res) => {
    //creating a query for userId
    const userId = req.query.userId; //getting the userId from the query
    //creating a query for username
    const username = req.query.username; // getting the username from the query
    //try to get the user
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });//getting the user
        //removing the unneeded fields
        const { password, updatedAt, ...other } = user._doc;
        //successful status
        res.status(200).json(other);//returning the user
    } catch (err) {
        return res.status(500).json(err);//returning 500 if error
    }
});


//get friends
router.get("/friends/:userId", async (req, res) => {
    //try and catch block
    try {
        const user = await user.findById(req.params.userId); //getting the user
        const friends = await Promise.all( //getting all the friends
            user.followings.map((friendId) => {
                return User.findById(friendId); //getting the friend
            })
        );
        //creating a friend list
        let friendList = []; //creating an empty array
        friends.map((friend) => { //iterating through the friends
            const { _id, username, profilePicture } = friend; //getting the friend's id, username and profilePicture
            friendList.push({ _id, username, profilePicture }); //adding the friend to the friendList
        });
        res.status(200).json(friendList); //returning the friendList
    } catch (err) {
        return res.status(500).json(err);//returning 500 if error
    }
});


//follow a user
router.put('/:id/follow', async (req, res) => {
    //if requested user is logged in user
    if (req.body.userId !== req.params.id) {
        //try to follow the user
        try {
            //find the requested user
            const user = await User.findById(req.params.id);

            //find the currentUser
            const currentUser = await User.findById(req.body.userId);

            //if the user is not already followed
            if (!user.followers.includes(req.body.userId)) {
                //update the user
                await user.updateOne({ $push: { followers: req.body.userId } });
                //update the current user
                await currentUser.updateOne({ $push: { followings: req.params.id } });

                //send successful status
                res.status(200).json("You are now following the user");
            }
            else {
                res.status(403).json("You are already following this user!");
            }
        } catch (err) {
            return res.status(500).json(err);//returning 500 if error
        }
    } else {
        //return error
        return res.status(403).json("You can't follow yourself!");
    }
});


//unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    //if requested user is logged in user
    if (req.body.userId !== req.params.id) {
        //try to follow the user
        try {
            //find the requested user
            const user = await User.findById(req.params.id);

            //find the currentUser
            const currentUser = await User.findById(req.body.userId);

            //if the user is not already followed
            if (user.followers.includes(req.body.userId)) {
                //update the user
                await user.updateOne({ $pull: { followers: req.body.userId } });
                //update the current user
                await currentUser.updateOne({ $pull: { followings: req.params.id } });

                //send successful status
                res.status(200).json("You have unfollwed the user");
            }
            else {
                res.status(403).json("You don't follow this user!");
            }
        } catch (err) {
            return res.status(500).json(err);//returning 500 if error
        }
    } else {
        //return error
        return res.status(403).json("You can't unfollow yourself!");
    }
});


//exporting router
module.exports = router;