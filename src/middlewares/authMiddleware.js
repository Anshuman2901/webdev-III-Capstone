const { verifyAccessToken } = require('../utils/tokenHelper');
const AppError = require('../utils/appError');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Bearer token missing.', 401));
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Access token expired. Please refresh your token.', 401));
      }
      return next(new AppError('Invalid token signature.', 401));
    }

    // Fetch user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticateJWT };
