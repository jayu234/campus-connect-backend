const mongoose = require("mongoose")

const doubtSchema = new mongoose.Schema({
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
    content: {
        type: String,
        require: true,
        minLength: [10, "Please provide valid input."]
    },
    answers: {
        type: [{ type: mongoose.Schema.Types.ObjectId }],
        ref: "Answer",
        default: []
    },
    edited: {
        type: Boolean,
        default: false
    },
    tags: [{ type: String }],
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
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Doubt = mongoose.model("doubts", doubtSchema);
module.exports = Doubt;