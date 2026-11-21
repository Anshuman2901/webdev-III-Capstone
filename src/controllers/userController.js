const User = require('../models/User');
const AppError = require('../utils/appError');

// GET /api/v1/users (Admin / Manager)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -refreshTokens').sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/users/:id/role (Admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'manager', 'developer'].includes(role)) {
      return next(new AppError('Invalid role specified', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after', runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: `User role updated to ${role}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
};
