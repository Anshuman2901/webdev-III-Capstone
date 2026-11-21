const EventEmitter = require('events');

class ApplicationEmitter extends EventEmitter {}

const appEmitter = new ApplicationEmitter();

// Register application event listeners
appEmitter.on('user:registered', (data) => {
  console.log(`[Event: user:registered] New user registered: ${data.email} (${data.name})`);
});

appEmitter.on('task:created', async (data) => {
  console.log(`[Event: task:created] Task "${data.title}" created by ${data.creatorEmail}`);
  try {
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      action: 'TASK_CREATED',
      details: `Task "${data.title}" was created`,
      user: data.userId,
    });
  } catch (err) {
    console.error('[EventEmitter Error] Failed to write activity log:', err.message);
  }
});

appEmitter.on('task:status_changed', async (data) => {
  console.log(`[Event: task:status_changed] Task "${data.taskId}" moved to "${data.newStatus}"`);
  try {
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      action: 'TASK_STATUS_UPDATED',
      details: `Task "${data.title || data.taskId}" changed to status: ${data.newStatus}`,
      user: data.userId,
    });
  } catch (err) {
    console.error('[EventEmitter Error] Failed to write activity log:', err.message);
  }
});

module.exports = appEmitter;
