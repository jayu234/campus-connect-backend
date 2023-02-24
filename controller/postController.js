const Post = require("../models/Post");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createPost = async (req, res, next) => {
    const post = await Post.create({
        ...req.body,
        auther: {
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
}

exports.updatePost = async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, {
        auther: req.user,
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
}

exports.deletePost = async (req, res, next) => {
    const post = await Post.findByIdAndRemove(req.params.id);

    if (!post) {
        return next(new ErrorHandler(500, "Failed to delete the post."));
    }

    return res.status(200).json({
        success: true,
        message: "Post deleted successfully."
    })
}

exports.getPostDetails = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler(404, "Post not found!"));
    }
    return res.status(200).json({
        success: true,
        result: post
    })
}

exports.getAllPostsOfUser = async (req, res, next) => {
    const allPosts = await Post.find({ auther: req.user });
    if (!allPosts) {
        return next(new ErrorHandler(404, "Failed to get all posts"));
    }
    return res.status(200).json({
        success: true,
        result: allPosts
    })
}
