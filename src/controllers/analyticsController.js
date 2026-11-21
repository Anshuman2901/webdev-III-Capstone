const Task = require('../models/Task');
const Project = require('../models/Project');

// GET /api/v1/analytics/tasks
// Demonstrates MongoDB Aggregation Pipeline ($match, $group, $sort, $project)
const getTaskAnalytics = async (req, res, next) => {
  try {
    // 1. Group tasks by Status
    const statusStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // 2. Group tasks by Priority
    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          priority: '$_id',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // 3. User workload distribution (tasks per user)
    const userWorkload = await Task.aggregate([
      {
        $match: { assignedTo: { $ne: null } },
      },
      {
        $group: {
          _id: '$assignedTo',
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$userDetails.name',
          userEmail: '$userDetails.email',
          totalAssigned: 1,
          completed: 1,
        },
      },
      {
        $sort: { totalAssigned: -1 },
      },
    ]);

    const totalTasks = await Task.countDocuments();
    const totalProjects = await Project.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalTasks,
          totalProjects,
        },
        statusDistribution: statusStats,
        priorityDistribution: priorityStats,
        userWorkload,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTaskAnalytics,
};
