const express = require('express');
const { getFeedData, getNearbyEvents, getRelatedDoubts } = require('../controller/utilsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.route("/feed").get(authenticate, getFeedData);
router.route("/relatedDoubts").get(authenticate, getRelatedDoubts);
router.route("/nearbyEvents").get(authenticate, getNearbyEvents);
module.exports = router;