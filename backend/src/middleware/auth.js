const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/apiResponse");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            return next();
        } catch (error) {
            console.error(error);
            return errorResponse(res, "Not authorized", 401);
        }
    }

    return errorResponse(res, "Not authorized, no token", 401);
};

const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return errorResponse(res, "Not authorized", 401);
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(res, "Access denied", 403);
        }

        next();
    };
};

module.exports = { protect, authorize };