const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.use(authenticateJWT);

router.get('/tasks', analyticsController.getTaskAnalytics);

module.exports = router;
