const catchAcyncError = require("../middleware/catchAcyncError");
const Topic = require("../models/Topic");
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const { getTrendingPosts } = require("../utils/trendingPostOfTopic");

exports.getAllTopics = catchAcyncError(async (req, res, next) => {

    let topics = await Topic.find();

    if (!topics) {
        return next(new ErrorHandler(500, "Internal server error"));
    }

    topics = topics.map((item) => {
        return {
            id: item._id,
            label: item.label,
            hashtag: item.hashtag,
            followers: item.followers.length,
            posts: item.posts.length
        }
    });

    res.status(200).json({
        success: true,
        data: topics
    })
});

exports.getTopicDetails = catchAcyncError(async (req, res, next) => {
    let topic = await Topic.findById(req.params.id);

    if (!topic) {
        return next(new ErrorHandler(500, "Internal server error"));
    }

    topic.followers = topic.followers.length
    topic.totalPosts = topic.posts.length
    // topic.trendingPosts = await getTrendingPosts(topic);
    res.status(200).json({
        success: true,
        data: topic
    })
});

exports.followUnfollow = catchAcyncError(async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
    let user = await User.findById(req.user._id);

    if (!topic) {
        return next(new ErrorHandler(500, "Internal server error"));
    }

    const index = topic.followers.indexOf(req.user._id);

    if (index !== -1) {
        topic.followers.splice(index, 1);
        await topic.save();

        user.interests = user.interests.filter((item) => item !== topic.label);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Topic unfollowed successfully!!"
        })
    } else {
        topic.followers.push(req.user._id)
        await topic.save();

        user.interests.push(topic.label);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "Topic followed successfully!!"
        })
    }
});