const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/authController");

// LOGIN ROUTE
router.post("/login", loginUser);

module.exports = router;
