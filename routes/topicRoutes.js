const express = require('express');
const { getAllTopics, getTopicDetails, followUnfollow } = require('../controller/topicController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.route('/topic/all').get(getAllTopics);
router.route('/topic/:id').get(getTopicDetails);
router.route('/topic/follow/:id').post(authenticate,followUnfollow);
module.exports = router;