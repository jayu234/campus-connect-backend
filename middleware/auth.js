const ErrorHandler = require("../utils/ErrorHandler")
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
    const { token } = req.cookies

    if(!token){
        return next(new ErrorHandler(401, "Please login to access resources"));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id);

    next();
}