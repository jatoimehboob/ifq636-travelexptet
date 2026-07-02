const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ⚠️ SIMPLE PASSWORD CHECK (if not using bcrypt in tests)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      role: user.role,
      id: user._id
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginUser
};
