const User = require("../models/User");

exports.createUser = async (req, res, next) => {
    // const {username, name, email, password, age, phone, avatar, college, city, interests } = req.body;

    const user = await User.create({
        ...req.body,
        avatar: {
            public_id: "654120",
            url: "https://www.google.com",
        },
    });
    if (!user) {
        return res.status(500).json({
            success: false,
            message: "Signup failed.",
        });
    }
    return res.status(201).json({
        success: true,
        result: [user],
    });
};

exports.userLogin = async (req, res, next) => { };

exports.updateUser = async (req, res, next) => { };

exports.deleteUser = async (req, res, next) => { };

exports.getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(500).json({
            success: false,
            message: "User not found",
        });
    }
    return res.status(201).json({
        success: true,
        result: [user],
    });
};

exports.getAllUser = async (req, res, next) => { };
