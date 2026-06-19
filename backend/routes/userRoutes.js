
const express = require('express');
const { getAllUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.put('/:id/status', protect, admin, updateUserStatus);

module.exports = router;
