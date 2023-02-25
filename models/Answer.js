const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema({
    doubt: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Doubt"
    },
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
        require: true
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
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    edited: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Answer = mongoose.model("answers", answerSchema);
module.exports = Answer;