const AppError = require('../utils/appError');

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password in request body', 400));
  }
  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  next();
};

const validateTask = (req, res, next) => {
  const { title, project } = req.body;
  if (!title || !project) {
    return next(new AppError('Task title and project ID are required', 400));
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
};
