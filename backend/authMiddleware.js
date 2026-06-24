const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * AUTH MIDDLEWARE
 * Verifies JWT and attaches user to req.user
 */
const protect = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            if (!user.isActive) {
                return res.status(403).json({ message: "User is deactivated" });
            }

            req.user = user; // 🔥 CRITICAL FOR RBAC
            return next();
        }

        return res.status(401).json({ message: "No token provided" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

/**
 * RBAC MIDDLEWARE
 * Only allows admin users
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({ message: "Forbidden: Admin only" });
};

module.exports = {
    protect,
    admin
};
