const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author: {
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
        required: true,
        minLength: [10, "Please provide valid title."]
    },
    content: {
        type: String,
        require: true,
    },
    tags: {
        type: [{ type: String }],
        default: [],
        minLength: [3, "Please provide required tags"]
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
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model("posts", postSchema);

module.exports = Post;