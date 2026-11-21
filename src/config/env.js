// [LECTURE 4: Node.js Modules]
// [LECTURE 5: Core Node.js Modules (path)]
// [LECTURE 29: Environment Variables & process.env]
// [LECTURE 30: Configuration Management & dotenv]

const path = require('path');
const dotenv = require('dotenv');

// Load .env file from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collabflow_capstone',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_jwt_access_secret_capstone_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret_capstone_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  student: {
    name: process.env.STUDENT_NAME || 'Anshuman Jha',
    rollNo: process.env.STUDENT_ROLL || '2501010110',
    course: 'Web Development Capstone'
  }
};

module.exports = config;
