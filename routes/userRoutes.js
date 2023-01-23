const express = require('express');
const { getUser, createUser, userLogin, updateUser, deleteUser } = require('../controller/userController');

const router = express.Router();

router.route('/user/signup').post(createUser);
router.route('/user/login').post(userLogin);
router.route('/user/update').put(updateUser);
router.route('/user/:id').get(getUser).delete(deleteUser);

module.exports = router;