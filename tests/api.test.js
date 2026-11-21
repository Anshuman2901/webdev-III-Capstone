const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const connectDB = require('../src/config/db');
const { app } = require('../src/server');

test('CollabFlow Full HTTP Methods Test Suite (GET, POST, PUT, PATCH, DELETE)', async (t) => {
  let adminToken = '';
  let refreshToken = '';
  let projectId = '';
  let taskId = '';
  let testUserId = '';

  // Connect to DB before tests run
  await connectDB();

  // 1. GET - Health Check
  await t.test('1. [GET] /api/v1/health - Returns 200 and student details', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.strictEqual(res.body.student.name, 'Anshuman Jha');
    assert.strictEqual(res.body.student.rollNo, '2501010110');
  });

  // 2. POST - Login Admin
  await t.test('2. [POST] /api/v1/auth/login - Authenticates and returns JWT Access & Refresh tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'anshuman@example.com',
        password: 'Password123!',
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.data.tokens.accessToken);
    assert.ok(res.body.data.tokens.refreshToken);

    adminToken = res.body.data.tokens.accessToken;
    refreshToken = res.body.data.tokens.refreshToken;
  });

  // 3. POST - Create New User (Register)
  await t.test('3. [POST] /api/v1/auth/register - Creates a new user record', async () => {
    const randomEmail = `dev_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Saurabh Developer',
        email: randomEmail,
        password: 'Password123!',
        role: 'developer',
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.data.user.id);
    testUserId = res.body.data.user.id;
  });

  // 4. POST - Refresh Token
  await t.test('4. [POST] /api/v1/auth/refresh - Generates new access token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.data.accessToken);
  });

  // 5. POST - Create Project
  await t.test('5. [POST] /api/v1/projects - Creates a new project in MongoDB', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Project Automated',
        description: 'Created during HTTP method test',
        status: 'planning',
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.data.project._id);
    projectId = res.body.data.project._id;
  });

  // 6. GET - List Projects
  await t.test('6. [GET] /api/v1/projects - Retrieves all projects with populated members', async () => {
    const res = await request(app)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(Array.isArray(res.body.data.projects));
  });

  // 7. POST - Create Task
  await t.test('7. [POST] /api/v1/tasks - Creates a new task and emits events', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Automated Postman Test Task',
        description: 'Verifying POST method for tasks',
        project: projectId,
        priority: 'high',
        status: 'todo',
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.data.task._id);
    taskId = res.body.data.task._id;
  });

  // 8. GET - Get Single Task by ID
  await t.test('8. [GET] /api/v1/tasks/:id - Retrieves single task by its ObjectId', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.strictEqual(res.body.data.task.title, 'Automated Postman Test Task');
  });

  // 9. PUT - Update Task (Status & Priority)
  await t.test('9. [PUT] /api/v1/tasks/:id - Updates task fields (Full Update)', async () => {
    const res = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'completed',
        priority: 'urgent',
        description: 'Updated via PUT request test',
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.strictEqual(res.body.data.task.status, 'completed');
    assert.strictEqual(res.body.data.task.priority, 'urgent');
  });

  // 10. PUT - Update Project
  await t.test('10. [PUT] /api/v1/projects/:id - Updates project details', async () => {
    const res = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Project Updated Title',
        status: 'in-progress',
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.strictEqual(res.body.data.project.status, 'in-progress');
  });

  // 11. PATCH - Update User Role (RBAC)
  await t.test('11. [PATCH] /api/v1/users/:id/role - Updates user role (Partial Update)', async () => {
    const res = await request(app)
      .patch(`/api/v1/users/${testUserId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        role: 'manager',
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.strictEqual(res.body.data.user.role, 'manager');
  });

  // 12. GET - Analytics Aggregation Pipeline
  await t.test('12. [GET] /api/v1/analytics/tasks - Returns MongoDB aggregation pipeline data', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/tasks')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.data.statusDistribution);
  });

  // 13. DELETE - Delete Task by ID
  await t.test('13. [DELETE] /api/v1/tasks/:id - Deletes the created task', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.strictEqual(res.body.message, 'Task deleted successfully');

    // Confirm it is gone
    const checkRes = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(checkRes.statusCode, 404);
  });

  // 14. DELETE - Delete Project by ID
  await t.test('14. [DELETE] /api/v1/projects/:id - Deletes project by ID', async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.strictEqual(res.body.message, 'Project deleted successfully');
  });

  // Disconnect mongoose so test finishes cleanly
  const mongoose = require('mongoose');
  await mongoose.connection.close();
});
