//calling router
const router = require('express').Router();
//calling Post
const Post = require('../models/Post');


//create a post 
router.post('/', async (req, res) => {
    //creating a new post
    const newPost = new Post(req.body);
    //try catch
    try {
        //saving the post
        const savedPost = await newPost.save();
        //succes message
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);//if error
    }
});


//update a post
router.put('/:id', async (req, res) => {
    try {
        //finding the post by id
        const post = await Post.findById(req.params.id);
        //if post.userid is equal to req.body.userId
        if (post.userId === req.body.userId) {
            //updating the post
            await post.updateOne({ $set: req.body });//req.body.title, req.body.content
            //status code
            res.status(200).json("The post has been updated");
        } else {
            res.status(403).json("You can only update your post");
        }
    } catch (err) {
        res.status(500).json(err);//if error
    }

});


//delete a post
router.delete('/:id', async (req, res) => {
    try {
        //finding the post by id
        const post = await Post.findById(req.params.id);
        //if post.userid is equal to req.body.userId
        if (post.userId === req.body.userId) {
            //updating the post
            await post.deleteOne();
            //status code
            res.status(200).json("The post has been deleted");
        } else {
            res.status(403).json("You can delete only your post");
        }
    } catch (err) {
        res.status(500).json(err);//if error
    }

});


//like a post and dislike a post
router.put('/:id/like', async (req, res) => {
    //try catch
    try {
        //finding the post by id
        const post = await Post.findById(req.params.id);
        //if post.userid is equal to req.body.userId
        if (!post.likes.includes(req.body.userId)) {
            //updating the post
            await post.updateOne({ $push: { likes: req.body.userId } });
            //status code
            res.status(200).json("The post has been liked");
        }
        //else disliking the user
        else{
            await post.updateOne({ $pull: { likes: req.body.userId } });//req.body.title, req.body.content
            res.status(200).json("The post has been unliked");
        }
    } catch (err) {
        res.status(500).json(err);//if error
    }
});

//get a post

//get timeline posts

//exporting router
module.exports = router;