const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================
// AUTH MIDDLEWARE
// =====================
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      _id: user._id,
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// =====================
// RBAC MIDDLEWARE
// =====================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { protect, adminOnly };
