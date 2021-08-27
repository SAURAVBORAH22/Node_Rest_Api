//calling router
const router = require('express').Router();
//calling Post
const Message = require('../models/Message');

//add message route
router.post('/', async (req, res) => {
    const newMessage = new Message(req.body); //create new message

    //try and catch block
    try {
        const savedMessage = await newMessage.save(); //save message
        res.status(200).json(savedMessage); //return message
    } catch (err) {
        res.status(500).send(err); //if error, return 500
    }
});


//get all messages
router.get("/:conversationId", async (req, res) => {
    //try and catch block
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages); //return messages
    } catch (err) {
        res.status(500).json(err); //if error, return 500
    }
});

//exporting router
module.exports = router;