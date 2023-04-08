const catchAcyncError = require("../middleware/catchAcyncError");
const ErrorHandler = require("../utils/ErrorHandler");


exports.getFeedData = catchAcyncError(async(req, res, next)=>{
    res.status(200).json({
        success: true,
        results: []
    })
})