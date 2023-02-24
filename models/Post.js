const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    auther: {
        type: {
            _id: mongoose.Schema.Types.ObjectId,
            username: String,
            name: String,
            email: String,
            avatar: {
                public_id: String,
                url: String
            }
        },
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    tags: {
        type: [{ type: String }],
        default: [],
        min: [3, "Please provide required tags"]
    },
    location: {
        type: String
    },
    images: {
        type: [{
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }],
        default: []
    },
    edited:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model("posts", postSchema);

module.exports = Post;