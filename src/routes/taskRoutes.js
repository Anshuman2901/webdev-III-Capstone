const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/rbacMiddleware');
const { validateTask } = require('../middlewares/validateMiddleware');

// Authenticate all task routes
router.use(authenticateJWT);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(validateTask, taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(authorizeRoles('admin', 'manager'), taskController.deleteTask);

module.exports = router;
