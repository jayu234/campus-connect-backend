const express = require("express");
const { createAnswer, updateAnswer, getAnswerDetails, deleteAnswer, getAllAnswersOfUser } = require("../controller/answerController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.route("/answer/create").post(authenticate, createAnswer);
router.route("/answer/all").get(authenticate, getAllAnswersOfUser);
router.route("/answer/:id").get(authenticate, getAnswerDetails).put(authenticate, updateAnswer).delete(authenticate, deleteAnswer);

module.exports = router;