const catchAcyncError = require("../middleware/catchAcyncError");
const Post = require("../models/Post");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createPost = catchAcyncError(async (req, res, next) => {
    if(!req.body.images && (req.body.content.length < 50 )){
        return next(new ErrorHandler(400, "Please provide valid content."));
    }
    const post = await Post.create({
        ...req.body,
        author: {
            _id: req.user._id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        }
    });
    if (!post) {
        return next(new ErrorHandler(500, "Failed to create post!"));
    }
    return res.status(201).json({
        success: true,
        result: post
    })
})

exports.updatePost = catchAcyncError(async (req, res, next) => {
    if(!req.body.images && (req.body.content.length < 50 )){
        return next(new ErrorHandler(400, "Please provide valid content."));
    }
    const post = await Post.findByIdAndUpdate(req.params.id, {
        author: {
            _id: req.user._id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        },
        ...req.body,
        edited: true
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    if (!post) {
        return next(new ErrorHandler(500, "Failed to update the post."))
    }
    return res.status(200).json({
        success: true,
        result: post
    })
})

exports.deletePost = catchAcyncError(async (req, res, next) => {
    const post = await Post.findByIdAndRemove(req.params.id);

    if (!post) {
        return next(new ErrorHandler(500, "Failed to delete the post."));
    }

    return res.status(200).json({
        success: true,
        message: "Post deleted successfully."
    })
})

exports.getPostDetails = catchAcyncError(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler(404, "Post not found!"));
    }
    return res.status(200).json({
        success: true,
        result: post
    })
})

exports.getAllPostsOfUser = catchAcyncError(async (req, res, next) => {
    const allPosts = await Post.find({ author: req.user });
    if (!allPosts) {
        return next(new ErrorHandler(404, "Failed to get all posts"));
    }
    return res.status(200).json({
        success: true,
        result: allPosts
    })
})
