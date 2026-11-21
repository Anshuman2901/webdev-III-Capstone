const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/rbacMiddleware');

// All project routes require authentication
router.use(authenticateJWT);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(authorizeRoles('admin', 'manager'), projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProjectById)
  .put(authorizeRoles('admin', 'manager'), projectController.updateProject)
  .delete(authorizeRoles('admin'), projectController.deleteProject);

module.exports = router;
