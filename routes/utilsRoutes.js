const express = require('express');
const { getFeedData } = require('../controller/utilsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.route("/feed").get(authenticate, getFeedData);

module.exports = router;