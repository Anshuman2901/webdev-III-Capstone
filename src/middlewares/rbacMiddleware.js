const AppError = require('../utils/appError');

// RBAC Middleware: Restrict route access to specified roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden: Role '${req.user ? req.user.role : 'unauthenticated'}' does not have permission to perform this action. Required: [${allowedRoles.join(', ')}]`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
