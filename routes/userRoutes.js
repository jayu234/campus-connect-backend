const express = require('express');
const { getUser, createUser, userLogin, updateUser, deleteUser, getAllUsers, userLogout, forgotPassword } = require('../controller/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.route('/user/signup').post(createUser);
router.route('/user/login').post(userLogin);
router.route('/user/logout').post(userLogout);
router.route('/user/password/forgot').post(forgotPassword);
router.route('/user/update').put(authenticate, updateUser);
router.route('/user/all').get(authenticate, getAllUsers);
router.route('/user/:id').get(authenticate, getUser).delete(authenticate, deleteUser);

module.exports = router;