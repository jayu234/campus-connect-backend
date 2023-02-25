const catchAcyncError = require("../middleware/catchAcyncError");
const Answer = require("../models/Answer");
const Doubt = require("../models/Doubt")
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose")

exports.createDoubt = catchAcyncError(async (req, res, next) => {
    if(!req.body.images && (req.body.content.length < 10 )){
        return next(new ErrorHandler(400, "Please provide valid content."));
    }
    const doubt = await Doubt.create({
        author: {
            _id: req.user._id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        },
        ...req.body
    });

    if (!doubt) {
        return next(new ErrorHandler(500, "Failed to create doubt."));
    }
    return res.status(201).json({
        success: true,
        result: doubt
    })
})

exports.updateDoubt = catchAcyncError(async (req, res, next) => {
    if(!req.body.images && (req.body.content.length < 10 )){
        return next(new ErrorHandler(400, "Please provide valid content."));
    }
    const doubt = await Doubt.findByIdAndUpdate(req.params.id, {
        author: {
            _id: req.user._id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        },
        ...req.body,
        edited: true
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    if (!doubt) {
        return next(new ErrorHandler(500, "Failed to update the doubt."));
    }
    return res.status(200).json({
        success: true,
        result: doubt
    })
})

exports.deleteDoubt = catchAcyncError(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Find the doubt to be deleted
        const doubt = await Doubt.findById(req.params.id);

        // Delete all the corresponding answers
        await Answer.deleteMany({ _id: { $in: doubt.answers } }).session(session);

        // Delete the doubt
        await doubt.deleteOne({ session });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        return next(new ErrorHandler(500, "Failed to delete the doubt."))
    } finally {
        session.endSession();
        return res.status(200).json({
            success: true,
            message: "Doubt deleted successfully."
        })
    }

})

exports.getDoubtDetails = catchAcyncError(async (req, res, next) => {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
        return next(new ErrorHandler(404, "Doubt not found!"));
    }
    return res.status(200).json({
        success: true,
        result: doubt
    })
})

exports.getAllDoubtsOfUser = catchAcyncError(async (req, res, next) => {
    const allDoubts = await Doubt.find({ author: req.user });
    if (!allDoubts) {
        return next(new ErrorHandler(404, "Failed to get all posts"));
    }
    return res.status(200).json({
        success: true,
        result: allDoubts
    })
})
