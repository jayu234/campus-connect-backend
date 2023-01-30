const catchAcyncError = require("../middleware/catchAcyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendJwtToken");
const sendEmail = require("../utils/sendPwdResetEmail");

const User = require("../models/User");

exports.createUser = catchAcyncError(async (req, res, next) => {

    const user = await User.create({
        ...req.body,
        avatar: {
            public_id: "654120",
            url: "https://www.google.com",
        },
    });
    if (!user) {
        return next(new ErrorHandler(500, "Signup failed."));
    }
    sendToken(user, res, 201, "Signed up successfully")
})

exports.userLogin = catchAcyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler(400, "Enter email and password."))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler(401, "Invalid email."))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler(401, "Invalid password."))
    }

    sendToken(user, res, 200, "Logged in successfully");
})

exports.userLogout = catchAcyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

exports.updateUser = catchAcyncError(async (req, res, next) => {
    const edited = await User.findByIdAndUpdate(req.user.id, {
        ...req.body,
        avatar: {
            public_id: "654120",
            url: "https://www.google.com",
        }
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!edited) {
        return next(new ErrorHandler(500, "Couldn't update user."));
    }
    return res.status(200).json({
        success: true,
        result: edited
    })
});

exports.deleteUser = catchAcyncError(async (req, res, next) => {
    const userToDelete = await User.findOne({ _id: req.params.id, deleted: false });

    if (!userToDelete) {
        return next(new ErrorHandler(404, "User not found"));
    }
    userToDelete['deleted'] = true;
    const user = await User.findByIdAndUpdate(req.params.id, userToDelete, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        return next(new ErrorHandler(500, "Couldn't delete the user."));
    }
    return res.status(200).json({
        success: true,
        message: "User deleted successfully."
    })
});

exports.getUser = catchAcyncError(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id, deleted: false });
    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }
    return res.status(201).json({
        success: true,
        result: [user],
    });
});

exports.getAllUsers = catchAcyncError(async (req, res, next) => {
    if (req.user.role != "admin") {
        return next(new ErrorHandler(401, "You are not allowed to access this resource."));
    }
    const allUsers = await User.find({ deleted: false });
    if (!allUsers) {
        return next(new ErrorHandler(500, "Some error occurred."));
    }
    return res.status(200).json({
        success: true,
        result: allUsers
    })
});

exports.forgotPassword = catchAcyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset link is: \n\n ${url}`;

    try {

        await sendEmail({
            email: user.email,
            subject: "CampusConnect Password Recovery",
            message: message
        })

        return res.status(200).json({
            success: true,
            message: "Email sent successfully."
        })
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(500, "Internal server error."))
    }

})