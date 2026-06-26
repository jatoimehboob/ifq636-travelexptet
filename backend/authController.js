const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * LOGIN CONTROLLER
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role   // 🔥 CRITICAL FOR RBAC
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      id: user._id
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login
};
