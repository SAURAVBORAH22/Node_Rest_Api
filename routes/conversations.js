//calling router
const router = require('express').Router();
//calling Post
const Conversation = require('../models/Conversation');

//creating new conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId], //senderId and receiverId
    });

    try{
        const savedConversation = await newConversation.save(); //saving conversation
        res.status(200).json(savedConversation); //returning saved conversation
    } catch (err) {
        res.status(500).json(err); //internal server error
    }
});


//getting conversation of a user
router.get("/:userId", async (req,res)=>{ //getting conversation of a user
    try{
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] }
        });
        res.status(200).json(conversation); 
    } catch (err) {
        res.status(500).json(err); //internal server error
    }
});


//exporting router
module.exports = router;