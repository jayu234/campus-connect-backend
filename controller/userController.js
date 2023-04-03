const catchAcyncError = require("../middleware/catchAcyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendJwtToken");
const sendEmail = require("../utils/sendPwdResetEmail");
const crypto = require("crypto");

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
    // sendToken(user, res, 201, "Signed up successfully")
    res.status(201).json({
        success: true,
        message: "Signup successfully!!"
    })
})

exports.userLogin = catchAcyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler(400, "Enter email and password."))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler(401, "Invalid email or password."))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler(401, "Invalid email or password"))
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
    if (req.user.role !== "admin") {
        return next(new ErrorHandler(401, "You are not allowed to access this resource."));
    }
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }

    await user.remove();
    return res.status(200).json({
        success: true,
        message: "User deleted successfully."
    })
});

exports.getUser = catchAcyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }
    return res.status(201).json({
        success: true,
        result: [user],
    });
});

exports.getAllUsers = catchAcyncError(async (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorHandler(401, "You are not allowed to access this resource."));
    }
    const allUsers = await User.find({});
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
    const message = `
    <h1>Reset your CampusConnect account password</h1>
    <br>
    <a href="${url}">Click here to reset your password.</a>
    <br>
    <p>If you did not make this request then please ignore this email.</p>
    <br>
    Best regards.
    <br>
    CampusConnect service team.
    `;
    try {

        await sendEmail({
            email: user.email,
            subject: "CampusConnect Password Recovery",
            message: message
        })

        return res.status(200).json({
            success: true,
            message: `Email sent successfully for ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(500, "Internal server error."))
    }

})

exports.resetPassword = catchAcyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler(404, "Reset token invalid or has been expired."));
    }
    if (!req.body.password || !req.body.confirmPassword) {
        return next(new ErrorHandler(400, "Please enter password and confirm password"));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler(400, "Passwords doesn't match"));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, res, 200, "Password has been reset.");
})

exports.updatePassword = catchAcyncError(async (req, res, next) => {

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler(400, "Please enter necessary details."));
    }
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler(400, "Passwords doesn't match"));
    }

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler(400, "Incorrect password."));
    }
    user.password = newPassword;
    await user.save();

    sendToken(user, res, 200, "Password changed successfully.")

})