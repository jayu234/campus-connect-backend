const express = require("express");
const { createPost, getAllPostsOfUser, getPostDetails, updatePost, deletePost } = require("../controller/postController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.route('/post/create').post(authenticate, createPost);
router.route('/post/all').get(authenticate, getAllPostsOfUser);
router.route('/post/:id').get(authenticate, getPostDetails).put(authenticate, updatePost).delete(authenticate, deletePost);

module.exports = router