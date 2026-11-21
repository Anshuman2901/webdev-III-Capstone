const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/rbacMiddleware');

// Protect all user routes
router.use(authenticateJWT);

// View users (admin & manager)
router.get('/', authorizeRoles('admin', 'manager'), userController.getAllUsers);

// Change role (Admin only)
router.patch('/:id/role', authorizeRoles('admin'), userController.updateUserRole);

module.exports = router;
