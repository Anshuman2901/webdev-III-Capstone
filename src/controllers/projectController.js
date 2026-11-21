const Project = require('../models/Project');
const AppError = require('../utils/appError');

// POST /api/v1/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description, members, status } = req.body;

    if (!name) {
      return next(new AppError('Project name is required', 400));
    }

    const project = await Project.create({
      name,
      description,
      status: status || 'planning',
      createdBy: req.user._id,
      members: Array.isArray(members) ? members : [req.user._id],
    });

    res.status(201).json({
      status: 'success',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/projects
const getAllProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/projects/:id (Admin / Manager only)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
