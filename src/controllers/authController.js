const User = require('../models/User');
const AppError = require('../utils/appError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/tokenHelper');
const appEmitter = require('../events/appEmitter');

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError('An account with this email already exists', 409));
    }

    // Default to developer if invalid/not provided unless admin explicitly created
    const assignedRole = ['admin', 'manager', 'developer'].includes(role)
      ? role
      : 'developer';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Store refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Emit event
    appEmitter.emit('user:registered', {
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password credentials', 401));
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Store refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return next(new AppError('Refresh token required in request body', 400));
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return next(new AppError('Invalid or expired refresh token. Please log in again.', 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if refresh token exists in user's valid tokens
    const tokenIndex = user.refreshTokens.findIndex((rt) => rt.token === token);
    if (tokenIndex === -1) {
      return next(new AppError('Refresh token has been revoked or reused', 403));
    }

    // Generate new Access Token
    const newAccessToken = generateAccessToken({ id: user._id, role: user.role });

    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/logout
const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (token && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter((rt) => rt.token !== token);
      await req.user.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    },
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};
