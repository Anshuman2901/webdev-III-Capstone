const jwt = require('jsonwebtoken');
const config = require('../config/env');

// Generate short-lived Access Token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

// Generate long-lived Refresh Token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

// Verify Access Token
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret);
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
