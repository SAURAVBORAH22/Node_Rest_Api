//calling mongoose
const mongoose = require('mongoose');

//creating a PostSchema
const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
},
    { timestamps: true } //include createdAt and updatedAt fields
);

//exporting the PostSchema
module.exports = mongoose.model('Post', PostSchema);