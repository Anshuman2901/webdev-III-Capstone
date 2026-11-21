const Task = require('../models/Task');
const AppError = require('../utils/appError');
const appEmitter = require('../events/appEmitter');

// POST /api/v1/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate: dueDate || null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Emit event through Node.js EventEmitter
    appEmitter.emit('task:created', {
      taskId: task._id,
      title: task.title,
      creatorEmail: req.user.email,
      userId: req.user._id,
    });

    // Real-time broadcast if socket.io is available on req.app
    const io = req.app.get('io');
    if (io) {
      io.to(`project:${project}`).emit('task:created', populatedTask);
      io.emit('notification', {
        type: 'TASK_CREATED',
        message: `New task created: "${task.title}" by ${req.user.name}`,
        task: populatedTask,
      });
    }

    res.status(201).json({
      status: 'success',
      data: { task: populatedTask },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks
// Demonstrates query operations: filtering, regex search, sorting, pagination
const getAllTasks = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Build filter
    const filter = { ...queryObj };

    // Search query using regex
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Direct filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.project) filter.project = req.query.project;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    // Sorting
    let sortBy = '-createdAt';
    if (req.query.sort) {
      sortBy = req.query.sort.split(',').join(' ');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      pagination: {
        total: totalTasks,
        page,
        pages: Math.ceil(totalTasks / limit) || 1,
        limit,
      },
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return next(new AppError('Task not found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return next(new AppError('Task not found with that ID', 404));
    }

    const previousStatus = existingTask.status;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // If status changed, emit EventEmitter event
    if (req.body.status && req.body.status !== previousStatus) {
      appEmitter.emit('task:status_changed', {
        taskId: updatedTask._id,
        title: updatedTask.title,
        oldStatus: previousStatus,
        newStatus: req.body.status,
        userId: req.user._id,
      });

      // Broadcast via Socket.IO
      const io = req.app.get('io');
      if (io) {
        io.to(`project:${updatedTask.project._id}`).emit('task:updated', updatedTask);
        io.emit('notification', {
          type: 'TASK_STATUS_CHANGED',
          message: `Task "${updatedTask.title}" status changed to ${req.body.status}`,
          task: updatedTask,
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: { task: updatedTask },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return next(new AppError('Task not found with that ID', 404));
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`project:${task.project}`).emit('task:deleted', { taskId: task._id });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
