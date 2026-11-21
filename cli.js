#!/usr/bin/env node

/**
 * CollabFlow CLI Diagnostic & Seeder Tool
 * Student: Anshuman Jha | Roll No: 2501010110
 *
 * Demonstrates:
 * - process.argv and CLI flag parsing
 * - Core Node modules: os, path, fs, http
 * - Database seeding & diagnostics
 */

const os = require('os');
const path = require('path');
const fs = require('fs');
const http = require('http');

const config = require('./src/config/env');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Task = require('./src/models/Task');

const args = process.argv.slice(2);
const command = args[0] || '--info';

const printBanner = () => {
  console.log('===========================================================');
  console.log('        COLLABFLOW CLI DIAGNOSTIC & SEEDER UTILITY         ');
  console.log('-----------------------------------------------------------');
  console.log(` Student Name : ${config.student.name}`);
  console.log(` Roll Number  : ${config.student.rollNo}`);
  console.log(` Course       : ${config.student.course}`);
  console.log('===========================================================');
};

const showSystemInfo = () => {
  printBanner();
  console.log('\n[System Diagnostics (Node.js Core Modules)]');
  console.log(`- Operating System   : ${os.type()} ${os.release()} (${os.arch()})`);
  console.log(`- CPU Cores          : ${os.cpus().length}`);
  console.log(`- Free Memory        : ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- Total Memory       : ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- Node.js Version    : ${process.version}`);
  console.log(`- Current Working Dir: ${process.cwd()}`);
  console.log(`- Process ID (PID)   : ${process.pid}`);
  console.log(`- Process Platform   : ${process.platform}`);
  console.log('\n[Available CLI Commands]');
  console.log('  node cli.js --info      Display system diagnostic information');
  console.log('  node cli.js --seed      Seed database with initial sample data');
  console.log('  node cli.js --ping      Probe local HTTP server via core http module');
};

const seedDatabase = async () => {
  printBanner();
  console.log('\n[Database Seeder] Initializing connection to MongoDB...');
  try {
    await connectDB();

    console.log('[Database Seeder] Clearing existing test data...');
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});

    console.log('[Database Seeder] Creating default users (Admin, Manager, Developer)...');
    const admin = await User.create({
      name: 'Anshuman Jha (Admin)',
      email: 'anshuman@example.com',
      password: 'Password123!',
      role: 'admin',
    });

    const manager = await User.create({
      name: 'Neha Sharma (Manager)',
      email: 'neha@example.com',
      password: 'Password123!',
      role: 'manager',
    });

    const developer = await User.create({
      name: 'Rahul Verma (Developer)',
      email: 'rahul@example.com',
      password: 'Password123!',
      role: 'developer',
    });

    console.log('[Database Seeder] Creating sample projects...');
    const project1 = await Project.create({
      name: 'CollabFlow Core Platform',
      description: 'Backend & Frontend Real-time collaboration platform',
      status: 'in-progress',
      createdBy: admin._id,
      members: [admin._id, manager._id, developer._id],
    });

    const project2 = await Project.create({
      name: 'Mobile Client API',
      description: 'REST API service for mobile application client',
      status: 'planning',
      createdBy: manager._id,
      members: [manager._id, developer._id],
    });

    console.log('[Database Seeder] Creating sample tasks with various priorities & statuses...');
    await Task.create([
      {
        title: 'Design Mongoose Schema and Validation rules',
        description: 'Implement User, Project, and Task schemas with compound indexes',
        project: project1._id,
        assignedTo: developer._id,
        createdBy: admin._id,
        status: 'completed',
        priority: 'high',
      },
      {
        title: 'Implement JWT Access and Refresh Token rotation',
        description: 'Secure API endpoints with dual token auth flow',
        project: project1._id,
        assignedTo: developer._id,
        createdBy: manager._id,
        status: 'in-progress',
        priority: 'urgent',
      },
      {
        title: 'Integrate Socket.IO for real-time task updates',
        description: 'Enable room-based messaging and live task state sync',
        project: project1._id,
        assignedTo: developer._id,
        createdBy: admin._id,
        status: 'todo',
        priority: 'medium',
      },
      {
        title: 'Setup MongoDB Aggregation Analytics pipeline',
        description: 'Build analytics endpoints grouping tasks by status and priority',
        project: project2._id,
        assignedTo: manager._id,
        createdBy: admin._id,
        status: 'review',
        priority: 'high',
      },
    ]);

    console.log('\n Seed completed successfully!');
    console.log(' Sample Credentials:');
    console.log('  Admin User     : anshuman@example.com / Password123!');
    console.log('  Manager User   : neha@example.com / Password123!');
    console.log('  Developer User : rahul@example.com / Password123!');
    process.exit(0);
  } catch (err) {
    console.error('[Database Seeder Error]:', err.message);
    process.exit(1);
  }
};

const probeServer = () => {
  printBanner();
  console.log(`\n[Core HTTP Probe] Pinging http://localhost:${config.port}/api/v1/health...`);

  const req = http.get(`http://localhost:${config.port}/api/v1/health`, (res) => {
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      console.log(`[HTTP Probe] Status Code: ${res.statusCode}`);
      console.log('[HTTP Probe] Response Data:');
      try {
        console.log(JSON.stringify(JSON.parse(rawData), null, 2));
      } catch (e) {
        console.log(rawData);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`[HTTP Probe Error] Server unreachable: ${e.message}`);
    console.log('Tip: Ensure the server is running with: npm start');
  });
};

switch (command) {
  case '--seed':
    seedDatabase();
    break;
  case '--ping':
    probeServer();
    break;
  case '--info':
  default:
    showSystemInfo();
    break;
}
