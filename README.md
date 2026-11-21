# 🚀 CollabFlow — Enterprise Project & Real-Time Collaboration Platform

> An enterprise-style project and task management platform built with Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, and Socket.IO.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-Framework-black?logo=express" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Socket.IO-Real--Time-black?logo=socket.io" alt="Socket.IO">
  <img src="https://img.shields.io/badge/Authentication-JWT-blue" alt="JWT">
  <img src="https://img.shields.io/badge/Project-Academic%20Capstone-orange" alt="Academic Capstone">
</p>

---

## 👨‍💻 Project Information

| Detail | Information |
|---|---|
| **Project Name** | CollabFlow |
| **Student Name** | Anshuman Jha |
| **Roll Number** | 2501010110 |
| **Course** | Web Development Backend & Full-Stack Capstone |
| **Academic Year** | 2026 |
| **Project Type** | Backend & Full-Stack Web Development |

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [System Architecture](#-system-architecture)
4. [40-Lecture Syllabus Implementation](#-40-lecture-syllabus-implementation)
5. [Technology Stack](#-technology-stack)
6. [Project Directory Structure](#-project-directory-structure)
7. [Installation and Setup](#-installation-and-setup)
8. [Database Seeding and Demo Accounts](#-database-seeding-and-demo-accounts)
9. [REST API Documentation](#-rest-api-documentation)
10. [Real-Time Collaboration](#-real-time-collaboration)
11. [CLI Utility](#-cli-utility)
12. [Automated Testing](#-automated-testing)
13. [Web Dashboard](#-web-dashboard)
14. [Viva Voce Preparation](#-viva-voce-preparation)
15. [Conclusion](#-conclusion)

---

## 🌟 Project Overview

**CollabFlow** is a project and task management platform designed to help teams organize projects, assign tasks, monitor progress, and collaborate in real time.

The application is developed using **Node.js, Express.js, MongoDB, Mongoose ODM, JWT Authentication, and Socket.IO**.

The primary objective of this academic capstone project is to demonstrate practical implementation of backend and full-stack web development concepts covered across **40 lectures in Units 1, 2, 3, and 4**.

### Problems Solved by CollabFlow

- **Centralized Project Management:** Provides a common platform to create projects, organize tasks, assign responsibilities, and track deadlines.
- **Role-Based Access Control:** Defines separate permissions for Admin, Manager, and Developer accounts.
- **Real-Time Collaboration:** Enables users to exchange messages and receive instant task updates using Socket.IO.
- **Task Monitoring:** Supports task status, priority, searching, filtering, sorting, and pagination.
- **Team Analytics:** Uses MongoDB aggregation pipelines to calculate project and task statistics.
- **Activity Tracking:** Records important application activities using Node.js EventEmitter.

---

## 🚀 Key Features

### 🔐 Authentication and Security

- User registration and login.
- JWT-based authentication.
- Short-lived Access Tokens (15 minutes).
- Refresh Tokens (7 days).
- Refresh token validation and revocation.
- Password hashing using bcryptjs.
- Protected API routes.
- Role-Based Access Control (RBAC).

### 👥 User Roles and Permissions

The platform supports three primary roles:

| Role | Main Permissions |
|---|---|
| **Admin** | User role management, project deletion, administrative operations |
| **Manager** | Project creation, task creation, task assignment, analytics access |
| **Developer** | View tasks, update task status, participate in team collaboration |

### 📋 Project and Task Management

- Create, read, update, and delete projects.
- Create, read, update, and delete tasks.
- Assign tasks to team members.
- Set task priority and status.
- Search tasks using keywords.
- Filter tasks by status and priority.
- Sort records by selected fields.
- Paginate large result sets.

### 📊 MongoDB Analytics

MongoDB aggregation pipelines are used to calculate:

- Total projects.
- Total tasks.
- Task status distribution.
- Task priority distribution.
- Project and team activity statistics.

### ⚡ Real-Time Collaboration

- Project-based chat rooms.
- Real-time message broadcasting.
- Typing indicators.
- Task update notifications.
- Automatic dashboard updates using Socket.IO.

### 🧪 Development and Testing

- Custom Node.js CLI utility.
- Database seeding.
- Automated API testing using Node's Test Runner and Supertest.
- Postman API collection.
- Centralized error handling.
- Request logging and execution-time monitoring.

---

## 🏗️ System Architecture

CollabFlow follows the **MVC (Model-View-Controller)** architecture and separates the application into different layers.

```text
+-------------------------------------------------------------------+
|                           CLIENT TIER                             |
|                                                                   |
|        Web Dashboard / Postman Client / CLI Utility               |
+-------------------------------------------------------------------+
                                |
                         HTTP / WebSocket
                                |
                                v
+-------------------------------------------------------------------+
|                       EXPRESS & HTTP SERVER                       |
|                                                                   |
|              src/server.js + Socket.IO Server                     |
+-------------------------------------------------------------------+
                                |
                                v
+-------------------------------------------------------------------+
|                       MIDDLEWARE LAYER                            |
|                                                                   |
|       CORS | Morgan | JSON Parser | Logger | Error Handler        |
|                                                                   |
|          JWT Authentication | Role-Based Authorization           |
+-------------------------------------------------------------------+
                                |
                                v
+-------------------------------------------------------------------+
|                           ROUTES LAYER                            |
|                                                                   |
|       Auth Routes | Project Routes | Task Routes | User Routes    |
|                         Analytics Routes                          |
+-------------------------------------------------------------------+
                                |
                                v
+-------------------------------------------------------------------+
|                        CONTROLLER LAYER                           |
|                                                                   |
|       Authentication | Projects | Tasks | Users | Analytics      |
+-------------------------------------------------------------------+
                       /                  \
                      /                    \
                     v                      v
+--------------------------------+  +-------------------------------+
|       EVENT SYSTEM             |  |         MONGOOSE ODM          |
|                                |  |                               |
|     Node.js EventEmitter       |  |       Models and Schemas      |
|     Activity Logging           |  |       Validation and Indexes  |
|     Socket Notifications       |  |       Database Operations    |
+--------------------------------+  +-------------------------------+
                                               |
                                               v
                                  +-------------------------------+
                                  |        MONGODB DATABASE       |
                                  |                               |
                                  |  Users                        |
                                  |  Projects                     |
                                  |  Tasks                        |
                                  |  ActivityLogs                 |
                                  +-------------------------------+
```

### Architecture Explanation

1. **Client Layer:** Users interact with the application through the web dashboard or API clients.
2. **Server Layer:** Express handles HTTP requests, while Socket.IO supports real-time communication.
3. **Middleware Layer:** Handles authentication, authorization, logging, request parsing, and error handling.
4. **Routes Layer:** Directs incoming API requests to the appropriate controller.
5. **Controller Layer:** Contains application logic and handles database operations.
6. **Event System:** Uses EventEmitter to trigger internal application events and activity logging.
7. **Database Layer:** MongoDB stores application data, while Mongoose manages schemas, validation, and database interactions.

---

## 📚 40-Lecture Syllabus Implementation

The following matrix maps the course concepts to their intended implementation in CollabFlow.

### 🔷 Unit 1: Node.js Runtime and Core Backend Fundamentals

| Lecture | Topic | Implementation in CollabFlow | Relevant Files |
|---|---|---|---|
| 1 | Introduction to Backend Development | Client-server architecture and JSON request-response lifecycle | `src/server.js` |
| 2 | HTTP Fundamentals | GET, POST, PUT, PATCH, DELETE and HTTP status codes | `src/routes/`, `src/controllers/` |
| 3 | Node.js Runtime and NPM | Package configuration, dependencies and NPM scripts | `package.json` |
| 4 | Node.js Modules | CommonJS modules using `require()` and `module.exports` | `src/` |
| 5 | Core Node.js Modules | Usage of `fs`, `path`, `os`, and `http` | `cli.js`, `src/config/` |
| 6 | Process Object and CLI | `process.argv`, `process.env`, `process.exit()` and SIGINT handling | `cli.js`, `src/server.js` |
| 7 | HTTP Server Development | Native HTTP server using `http.createServer()` | `src/server.js` |
| 8 | API Testing and Debugging | Automated testing using Node Test Runner and Supertest | `tests/api.test.js` |

### 🔷 Unit 2: Express.js and MVC Architecture

| Lecture | Topic | Implementation in CollabFlow | Relevant Files |
|---|---|---|---|
| 9 | Introduction to Express.js | Express application and middleware configuration | `src/server.js` |
| 10 | CRUD Fundamentals | Create, Read, Update, Delete operations | `src/controllers/` |
| 11 | Request and Response Handling | `req.params`, `req.query`, `req.body`, `res.status()` | `src/controllers/` |
| 12 | Introduction to MVC Architecture | Models, Views, and Controllers separation | `src/models/`, `src/public/`, `src/controllers/` |
| 13 | Controllers and Business Logic | Controller-based application logic | `src/controllers/` |
| 14 | CRUD Operations using MVC | Request-to-controller-to-model workflow | `src/controllers/projectController.js` |
| 15 | Express Routing and REST APIs | Modular routes using `express.Router()` | `src/routes/` |
| 16 | Middleware Basics | Application-level and custom middleware | `src/middlewares/` |
| 17 | Middleware Chaining | Authentication, authorization, validation and controllers | `src/routes/taskRoutes.js` |
| 18 | Error Handling | Custom errors and centralized error middleware | `src/utils/appError.js`, `src/middlewares/errorMiddleware.js` |

### 🔷 Unit 3: Databases and Mongoose ODM

| Lecture | Topic | Implementation in CollabFlow | Relevant Files |
|---|---|---|---|
| 19 | Introduction to Databases (SQL vs NoSQL) | MongoDB document-oriented database | MongoDB models |
| 20 | MongoDB Basics and Configuration | Local MongoDB and Atlas connection configuration | `src/config/db.js` |
| 21 | MongoDB CRUD Operations | `create()`, `find()`, `findById()`, update and delete operations | `src/controllers/` |
| 22 | Query Operations in MongoDB | Regex search, sorting, filtering and pagination | `src/controllers/taskController.js` |
| 23 | Aggregation Pipeline and Indexing | `$match`, `$group`, `$sort`, `$project`, `$lookup` and indexes | `src/controllers/analyticsController.js`, `src/models/Task.js` |
| 24 | Data Modelling and Relationships | User, Project and Task references using ObjectId and `populate()` | `src/models/` |
| 25 | Mongoose ODM and Schema Design | Typed fields, timestamps, defaults and references | `src/models/` |
| 26 | Data Validation using Mongoose | Required fields, enums, length and custom validators | `src/models/User.js` |
| 27 | Connecting Node.js with MongoDB | `mongoose.connect()` and connection events | `src/config/db.js` |
| 28 | Building REST APIs with DB Integration | Database-backed API endpoints | `src/routes/`, `src/controllers/` |

### 🔷 Unit 4: Advanced Security, Authentication and Real-Time Communication

| Lecture | Topic | Implementation in CollabFlow | Relevant Files |
|---|---|---|---|
| 29 | Environment Variables | Configuration through `process.env` | `src/config/env.js` |
| 30 | Config Management and dotenv | Centralized environment configuration | `.env`, `.env.example` |
| 31 | Authentication | User registration and login | `src/controllers/authController.js` |
| 32 | Authorization Concepts | Authentication and authorization separation | `src/middlewares/rbacMiddleware.js` |
| 33 | Password Hashing (bcrypt) | Password hashing and password comparison | `src/models/User.js` |
| 34 | JWT (JSON Web Tokens) | JWT generation and verification | `src/utils/tokenHelper.js` |
| 35 | Access Tokens and Refresh Tokens | Short-lived access tokens and refresh-token handling | `src/controllers/authController.js` |
| 36 | Protected Routes | Bearer token verification middleware | `src/middlewares/authMiddleware.js` |
| 37 | RBAC | Role-based endpoint access | `src/middlewares/rbacMiddleware.js` |
| 38 | EventEmitter | Internal events and activity logging | `src/events/appEmitter.js` |
| 39 | WebSockets | Persistent, bidirectional client-server communication | `src/server.js` |
| 40 | Socket.IO | Real-time chat, rooms and task notifications | `src/sockets/socketHandler.js` |

---

## 💻 Technology Stack

### Backend Technologies

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express.js 4.21.2** | Backend web framework |
| **MongoDB** | NoSQL document database |
| **Mongoose 8.9.2** | Object Data Modeling (ODM) |
| **Socket.IO 4.8.1** | Real-time bidirectional communication |
| **bcryptjs 2.4.3** | Password hashing |
| **jsonwebtoken 9.0.2** | JWT generation and verification |
| **dotenv 16.4.7** | Environment variable management |
| **Morgan** | HTTP request logging |
| **CORS** | Cross-Origin Resource Sharing |

### Testing and Development

| Technology | Purpose |
|---|---|
| **Node.js Test Runner** | Native automated testing |
| **Node Assert** | Test assertions |
| **Supertest 7.0.0** | HTTP endpoint testing |
| **Nodemon 3.1.9** | Automatic server restart during development |
| **Postman** | Manual API testing |

### Frontend Technologies

| Technology | Purpose |
|---|---|
| **HTML5** | Web page structure |
| **CSS3** | Responsive dashboard styling |
| **JavaScript ES6+** | Client-side application logic |
| **Socket.IO Client** | Real-time frontend communication |

---

## 📁 Project Directory Structure

```text
CollabFlow/
│
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .gitignore
├── cli.js
├── Postman_Collection.json
├── README.md
│
├── tests/
│   └── api.test.js
│
└── src/
    │
    ├── server.js
    │
    ├── config/
    │   ├── env.js
    │   └── db.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   ├── Task.js
    │   └── ActivityLog.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── projectController.js
    │   ├── taskController.js
    │   └── analyticsController.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── projectRoutes.js
    │   ├── taskRoutes.js
    │   └── analyticsRoutes.js
    │
    ├── middlewares/
    │   ├── authMiddleware.js
    │   ├── rbacMiddleware.js
    │   ├── validateMiddleware.js
    │   ├── loggerMiddleware.js
    │   └── errorMiddleware.js
    │
    ├── events/
    │   └── appEmitter.js
    │
    ├── sockets/
    │   └── socketHandler.js
    │
    ├── utils/
    │   ├── appError.js
    │   └── tokenHelper.js
    │
    └── public/
        ├── index.html
        ├── app.js
        └── style.css
```

---

## ⚙️ Installation and Setup

Follow these steps to run CollabFlow on your local machine.

### 1. Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/) — Version 18 or above.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas account.
- [Visual Studio Code](https://code.visualstudio.com/) — Recommended code editor.
- [Postman](https://www.postman.com/downloads/) — For API testing.

Verify the installations:

```bash
node -v
npm -v
mongod --version
```

### 2. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project folder:

```bash
cd CollabFlow
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory.

Add the following configuration:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/collabflow_capstone

JWT_ACCESS_SECRET=replace_with_a_strong_random_access_secret
JWT_REFRESH_SECRET=replace_with_a_strong_random_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

STUDENT_NAME=Anshuman Jha
STUDENT_ROLL=2501010110
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

**Important:** Never commit your actual `.env` file, database credentials, or JWT secrets to GitHub. Add `.env` to `.gitignore` and commit only `.env.example` with placeholder values.

### 5. Seed the Database

Run the database seeder:

```bash
npm run seed
```

This command inserts the sample users, projects, and tasks into MongoDB.

> **Warning:** The seeder may clear existing collections before inserting sample data. Do not run it against a production database or a database containing important personal data.

### 6. Start the Server

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

After successful startup, the server should be available at:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/api/v1/health
```

### 7. Open the Web Dashboard

Open your browser and visit:

```text
http://localhost:5000
```

The CollabFlow dashboard will be available after the server and database connection are running successfully.

---

## 👥 Database Seeding and Demo Accounts

After running the seed command, the database is populated with sample users representing all three application roles.

| Role | Name | Email | Password |
|---|---|---|---|
| 👑 Admin | Anshuman Jha | `anshuman@example.com` | `Password123!` |
| 👔 Manager | Neha Sharma | `neha@example.com` | `Password123!` |
| 💻 Developer | Rahul Verma | `rahul@example.com` | `Password123!` |

### Role Permissions

**Admin**
- Access administrative functionality.
- Manage user roles.
- Delete projects.
- Manage platform resources.

**Manager**
- Create and update projects.
- Create and manage tasks.
- Assign team members.
- View analytics.

**Developer**
- View assigned tasks.
- Update task status.
- Participate in project chat.
- Receive task notifications.

> These are demonstration credentials for a local academic setup. Change or remove them before any public deployment.

---

## 📡 REST API Documentation

CollabFlow exposes versioned REST API endpoints under:

```text
/api/v1
```

The API uses JSON for request and response data.

### HTTP Methods Used

| HTTP Method | Purpose |
|---|---|
| GET | Retrieve resources |
| POST | Create resources |
| PUT | Update resources |
| PATCH | Partially update resources |
| DELETE | Remove resources |

### 1. Health Check

**Endpoint:**

```http
GET /api/v1/health
```

**Access:** Public

**Description:** Checks whether the server is running and returns application information.

**Example Response:**

```json
{
  "status": "success",
  "service": "CollabFlow API",
  "uptime": "25 seconds",
  "timestamp": "2026-11-21T07:30:00.000Z",
  "student": {
    "name": "Anshuman Jha",
    "rollNo": "2501010110",
    "course": "Web Development Capstone"
  }
}
```

### 2. Authentication Endpoints

Base path:

```text
/api/v1/auth
```

#### Register a User

```http
POST /api/v1/auth/register
```

**Request Body:**

```json
{
  "name": "Saurabh Kumar",
  "email": "saurabh@example.com",
  "password": "Password123!",
  "role": "developer"
}
```

**Expected Response:** `201 Created`

Creates a new user account and returns authentication tokens.

#### User Login

```http
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "email": "anshuman@example.com",
  "password": "Password123!"
}
```

**Expected Response:** `200 OK`

Returns the access token and refresh token.

#### Refresh Token

```http
POST /api/v1/auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**Expected Response:** `200 OK`

Validates the refresh token and issues a new access token. Refresh-token rotation should follow the implementation in the authentication controller.

#### Get Current User

```http
GET /api/v1/auth/me
```

**Access:** Protected

**Required Header:**

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response:** `200 OK`

Returns the authenticated user's profile.

### 3. Project Management Endpoints

Base path:

```text
/api/v1/projects
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/projects` | Authenticated | Get all projects |
| POST | `/api/v1/projects` | Admin, Manager | Create a project |
| PUT | `/api/v1/projects/:id` | Admin, Manager | Update a project |
| DELETE | `/api/v1/projects/:id` | Admin | Delete a project |

#### Create Project

```http
POST /api/v1/projects
```

**Request Body:**

```json
{
  "name": "AI Collaboration Module",
  "description": "Smart agent integration in project workspace",
  "status": "planning"
}
```

**Expected Response:** `201 Created`

Creates a new project in MongoDB.

#### Update Project

```http
PUT /api/v1/projects/PROJECT_ID
```

**Request Body:**

```json
{
  "name": "AI Collaboration Module",
  "description": "Updated project description",
  "status": "in-progress"
}
```

#### Delete Project

```http
DELETE /api/v1/projects/PROJECT_ID
```

**Access:** Admin only

**Expected Response:** `200 OK`

### 4. Task Management Endpoints

Base path:

```text
/api/v1/tasks
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/tasks` | Authenticated | Get tasks with filters |
| GET | `/api/v1/tasks/:id` | Authenticated | Get a specific task |
| POST | `/api/v1/tasks` | Authenticated | Create a task |
| PUT | `/api/v1/tasks/:id` | Authenticated | Update a task |
| DELETE | `/api/v1/tasks/:id` | Admin, Manager | Delete a task |

#### Get Tasks with Filters

```http
GET /api/v1/tasks
```

**Supported Query Parameters:**

| Parameter | Description | Example |
|---|---|---|
| `page` | Page number | `page=1` |
| `limit` | Records per page | `limit=10` |
| `status` | Filter by task status | `status=todo` |
| `priority` | Filter by priority | `priority=high` |
| `search` | Search by title or description | `search=website` |
| `sort` | Sort records | `sort=-createdAt` |

**Example Request:**

```http
GET /api/v1/tasks?page=1&limit=10&status=todo&priority=high&sort=-createdAt
```

**Example Response:**

```json
{
  "status": "success",
  "results": 4,
  "pagination": {
    "total": 4,
    "page": 1,
    "pages": 1,
    "limit": 10
  },
  "data": {
    "tasks": []
  }
}
```

#### Get a Single Task

```http
GET /api/v1/tasks/TASK_ID
```

**Access:** Authenticated

#### Create Task

```http
POST /api/v1/tasks
```

**Request Body:**

```json
{
  "title": "Build WebSockets Chat Layer",
  "description": "Implement real-time project communication",
  "project": "PROJECT_ID",
  "priority": "high",
  "status": "todo"
}
```

**Expected Response:** `201 Created`

Creates a task and can trigger an internal EventEmitter event and Socket.IO notification.

#### Update Task

```http
PUT /api/v1/tasks/TASK_ID
```

**Request Body:**

```json
{
  "status": "completed",
  "priority": "urgent"
}
```

**Expected Response:** `200 OK`

Updates the task and can notify connected project members.

#### Delete Task

```http
DELETE /api/v1/tasks/TASK_ID
```

**Access:** Admin, Manager

**Expected Response:** `200 OK`

### 5. Analytics Endpoint

```http
GET /api/v1/analytics/tasks
```

**Access:** Authenticated

**Description:** Returns task analytics generated through MongoDB aggregation pipelines.

Aggregation stages used include:

- `$match`
- `$group`
- `$sort`
- `$project`
- `$lookup`

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalTasks": 4,
      "totalProjects": 2
    },
    "statusDistribution": [
      {
        "status": "completed",
        "count": 1
      },
      {
        "status": "in-progress",
        "count": 1
      },
      {
        "status": "todo",
        "count": 1
      },
      {
        "status": "review",
        "count": 1
      }
    ],
    "priorityDistribution": [
      {
        "priority": "high",
        "count": 2
      },
      {
        "priority": "urgent",
        "count": 1
      },
      {
        "priority": "medium",
        "count": 1
      }
    ]
  }
}
```

### 6. User Management Endpoint

#### Update User Role

```http
PATCH /api/v1/users/USER_ID/role
```

**Access:** Admin only

**Request Body:**

```json
{
  "role": "manager"
}
```

**Expected Response:** `200 OK`

Updates a user's role according to the application's RBAC rules.

---

## ⚡ Real-Time Collaboration

CollabFlow uses **Node.js EventEmitter and Socket.IO** to support internal event handling and real-time communication.

### Event-Driven Workflow

```text
                  Task Controller
                        |
             Task Created / Updated
                        |
              +---------+---------+
              |                   |
              v                   v
       Node EventEmitter      Socket.IO Server
              |                   |
              v                   v
       Activity Logging       Real-Time Events
              |                   |
              v                   v
        MongoDB Logs         Project Room Clients
                                  |
                                  v
                           Live Dashboard Update
```

### 1. Node.js EventEmitter

EventEmitter is used for internal application events.

Example event names:

```text
task:created
task:status_changed
```

When an event occurs, registered listeners can perform operations such as saving activity records in MongoDB.

### 2. Socket.IO

Socket.IO enables real-time communication between the server and connected clients.

**Supported Events:**

| Event | Purpose |
|---|---|
| `join:room` | Join a project collaboration room |
| `chat:message` | Send a message to a room |
| `chat:broadcast` | Receive messages from other room members |
| `notification` | Receive task-related notifications |
| `typing` | Indicate that a user is typing |

### Benefits

- Instant chat communication.
- Real-time project updates.
- Reduced need for manual page refreshes.
- Project-based communication rooms.
- Improved team collaboration.

---

## 🛠️ CLI Utility

CollabFlow includes a custom command-line utility named `cli.js`.

It demonstrates the use of Node.js core modules such as:

- `fs`
- `path`
- `os`
- `http`
- `process`

### 1. System Diagnostics

Run:

```bash
npm run cli
```

The diagnostic utility can display:

- Operating system information using `os.type()`.
- Kernel version using `os.release()`.
- CPU core count using `os.cpus().length`.
- Free RAM using `os.freemem()`.
- Total RAM using `os.totalmem()`.
- Node.js version.
- Process ID using `process.pid`.

### 2. Database Seeding

Run:

```bash
npm run seed
```

This command inserts sample users, projects, and tasks into the database.

### 3. Server HTTP Probe

Run:

```bash
node cli.js --ping
```

The utility uses Node.js `http.get()` to check the health endpoint:

```text
http://localhost:5000/api/v1/health
```

This helps verify whether the backend server is responding.

---

## 🧪 Automated API Testing

CollabFlow includes an automated API testing suite located at:

```text
tests/api.test.js
```

The test suite uses:

- Node.js built-in Test Runner.
- Node.js Assert module.
- Supertest.

### Run Tests

```bash
npm test
```

### Test Coverage

The test suite is designed to test the following operations:

| No. | Test Case | HTTP Method |
|---|---|---|
| 1 | Health check | GET |
| 2 | User login | POST |
| 3 | User registration | POST |
| 4 | Refresh token | POST |
| 5 | Create project | POST |
| 6 | Retrieve projects | GET |
| 7 | Create task | POST |
| 8 | Retrieve task by ID | GET |
| 9 | Update task | PUT |
| 10 | Update project | PUT |
| 11 | Update user role | PATCH |
| 12 | Retrieve task analytics | GET |
| 13 | Delete task | DELETE |
| 14 | Delete project | DELETE |

The test suite also checks authentication, authorization, database-backed operations, and expected HTTP responses where configured.

**Expected Test Summary (as reported for the project):**

```text
✔ CollabFlow Full HTTP Methods Test Suite

ℹ tests 15
ℹ pass 15
ℹ fail 0
ℹ cancelled 0
```

> Run `npm test` in your local environment to verify the actual test count and results.

---

## 🖥️ Web Dashboard

The CollabFlow web dashboard is served through Express static files.

Open the application at:

```text
http://localhost:5000
```

The dashboard provides the following sections.

### 1. Project Header

Displays academic project information:

- Student Name: Anshuman Jha
- Roll Number: 2501010110
- Course: Web Development Capstone

### 2. Syllabus Matrix

- Displays the course syllabus from Lecture 1 to Lecture 40.
- Groups topics by academic unit.
- Shows the mapping between lectures and project source files.

### 3. Project and Task Management

- Task listing and management.
- Search by title or description.
- Status and priority filters.
- Sorting and pagination.
- Inline task status updates.
- Task creation modal.
- Task deletion controls.

### 4. MongoDB Analytics

Displays key application statistics:

- Total projects.
- Total tasks.
- Completed tasks.
- Status distribution.
- Priority distribution.

The analytics information is generated through MongoDB aggregation queries.

### 5. Real-Time Collaboration

- Project chat room selection.
- Live message updates.
- Typing indicators.
- Task activity notifications.

### 6. Demo Login and RBAC

The dashboard provides demonstration access for the three sample roles:

- Admin — Anshuman Jha
- Manager — Neha Sharma
- Developer — Rahul Verma

This helps demonstrate how application permissions differ according to user roles.

---

## 📜 Viva Voce Preparation

The following questions can help explain the main concepts used in CollabFlow during a project demonstration.

| Question | Answer |
|---|---|
| What is Node.js? | Node.js is a JavaScript runtime environment used to execute JavaScript outside the browser. |
| What is Express.js? | Express.js is a Node.js framework used to build web applications and REST APIs. |
| What is MongoDB? | MongoDB is a NoSQL database that stores data in flexible BSON documents. |
| What is Mongoose? | Mongoose is an ODM library used to define schemas, validate data, and interact with MongoDB. |
| What is MVC? | MVC stands for Model-View-Controller. It separates data, user interface, and application logic. |
| What is middleware? | Middleware is a function that executes during the request-response cycle. |
| What is REST API? | A REST API allows applications to communicate through HTTP methods and resource-based URLs. |
| What is JWT? | JSON Web Token is a token format used to transfer signed information between parties. |
| What is authentication? | Authentication verifies the identity of a user. |
| What is authorization? | Authorization determines what an authenticated user is allowed to access. |
| What is bcrypt? | bcrypt is a password-hashing algorithm used to securely store passwords. |
| What is RBAC? | Role-Based Access Control assigns permissions according to user roles. |
| What is EventEmitter? | EventEmitter is a Node.js class used to create and handle custom events. |
| What is WebSocket? | WebSocket is a communication protocol that supports persistent, bidirectional communication. |
| What is Socket.IO? | Socket.IO is a library that provides real-time, event-based communication between clients and servers. |
| What is aggregation in MongoDB? | Aggregation processes documents through stages to calculate and transform data. |
| What is pagination? | Pagination divides a large set of records into smaller pages. |
| What is an index? | An index improves the efficiency of database queries. |

---

## 📌 Conclusion

CollabFlow demonstrates the practical application of backend and full-stack web development concepts through a project and task management platform.

The project brings together several important technologies and concepts:

- Node.js and Express.js backend development.
- MVC architecture and REST API design.
- MongoDB database operations and Mongoose ODM.
- Authentication using JWT and password hashing using bcryptjs.
- Role-Based Access Control.
- MongoDB aggregation and query optimization.
- Node.js EventEmitter and Socket.IO real-time communication.
- CLI utilities and automated API testing.
- HTML, CSS, and JavaScript-based dashboard development.

The project is designed to provide a practical understanding of how different backend technologies work together to build a collaborative web application.

---

## 🙏 Acknowledgements

**Developed by:** Anshuman Jha  
**Roll Number:** 2501010110  
**Course:** Web Development Backend & Full-Stack Capstone  
**Academic Year:** 2026  
**Submission Period:** November 2026

Thank you for visiting the CollabFlow project repository!

⭐ If you find this project useful, consider giving the repository a star.
