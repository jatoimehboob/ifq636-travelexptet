const adminOnly = (req, res, next) => {
  const user = req.user; // must be set by auth middleware

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

module.exports = adminOnly;
