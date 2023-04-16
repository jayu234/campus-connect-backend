const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: {
            public_id: { type: String },
            url: { type: String }
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        label:{
            type: String,
            required: true
        }
    }
}, { timestamps: true });

const Event = mongoose.model("events", eventSchema);
module.exports = Event;