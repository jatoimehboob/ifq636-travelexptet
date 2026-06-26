const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  updateUserStatus
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// 🔥 CRITICAL ORDER
router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.put("/:id/status", protect, adminOnly, updateUserStatus);

module.exports = router;
