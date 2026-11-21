# CollabFlow - Enterprise Project & Real-Time Collaboration Management Platform

> **Academic Capstone Project — Backend & Full-Stack Web Development**  
> **Student Name:** Anshuman Jha  
> **Roll Number:** 2501010110  
> **Course:** Web Development Backend & Full-Stack Capstone  
> **Academic Year:** 2026  

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Highlights & Capabilities](#-key-highlights--capabilities)
3. [System Architecture & Design Patterns](#-system-architecture--design-patterns)
4. [Comprehensive 40-Lecture Syllabus Matrix (Lectures 1 - 40)](#-comprehensive-40-lecture-syllabus-matrix)
5. [Tech Stack & Dependencies](#-tech-stack--dependencies)
6. [Folder & File Directory Structure](#-folder--file-directory-structure)
7. [Step-by-Step Installation & Setup Guide](#-step-by-step-installation--setup-guide)
8. [Database Seeding & Default Credentials](#-database-seeding--default-credentials)
9. [Complete REST API Reference (GET, POST, PUT, PATCH, DELETE)](#-complete-rest-api-reference)
10. [Real-Time Collaboration & WebSockets (Socket.IO & EventEmitter)](#-real-time-collaboration--websockets)
11. [CLI Utility & System Diagnostics (cli.js)](#-cli-utility--system-diagnostics)
12. [Automated API Testing Suite (tests/api.test.js)](#-automated-api-testing-suite)
13. [Web Dashboard & User Interface Walkthrough](#-web-dashboard--user-interface-walkthrough)
14. [Viva Voce & Presentation Questions & Answers](#-viva-voce--presentation-qa)

---

## 🌟 Project Overview

**CollabFlow** is a modern, enterprise-grade project and task management system built from the ground up using **Node.js, Express.js, MongoDB, Mongoose ODM, JWT Authentication (Access + Refresh tokens), and Socket.IO**.

The primary objective of this capstone project is to demonstrate **100% syllabus mastery** by implementing every single backend concept taught in class from **Lecture 1 through Lecture 40** (Units 1, 2, 3, and 4) in production-quality code.

### Core Problems CollabFlow Solves:
- **Centralized Project & Task Tracking:** Teams can organize workspaces, assign tasks, establish priority matrices, and manage deadlines.
- **Role-Based Governance (RBAC):** Strict security boundaries ensuring Developers, Managers, and Admins can only perform authorized actions.
- **Real-Time Synchronization:** Instant WebSocket broadcasts for live room chat and instantaneous task updates without manual page refreshes.
- **Deep Analytics:** MongoDB Aggregation Pipelines calculating team productivity, workload allocation, and project status breakdowns.

---

## 🚀 Key Highlights & Capabilities

- 🔐 **Dual-Token Authentication (JWT):** Short-lived Access Tokens (15 mins) and rotatable Refresh Tokens (7 days) stored securely in the database.
- 🛡️ **Role-Based Access Control (RBAC):** Three distinct roles (`admin`, `manager`, `developer`) guarding sensitive administrative operations.
- 📋 **Full MVC CRUD:** End-to-end Create, Read, Update, and Delete flows for Projects, Tasks, and User management.
- 🔍 **Advanced Querying & Pagination:** Dynamic filtering by status/priority, case-insensitive keyword search (`$regex`), sorting (`.sort()`), and pagination (`.skip()`, `.limit()`).
- 📊 **MongoDB Aggregation Pipelines:** Real-time metrics computed via multi-stage pipelines (`$match`, `$group`, `$sort`, `$project`, `$lookup`).
- ⚡ **Decoupled Architecture with EventEmitter:** Internal system events (e.g. task assignment, status transition) trigger asynchronous MongoDB activity logging without blocking the HTTP request thread.
- 💬 **Live Collaboration (WebSockets & Socket.IO):** Multi-room chat, typing indicators, and real-time task update notifications.
- 🖥️ **Custom CLI Utility (`cli.js`):** Built using core Node.js modules (`fs`, `path`, `os`, `http`, `process.argv`) for diagnostics and database seeding.
- 🧪 **Automated Test Suite (`tests/api.test.js`):** 15 automated test cases testing GET, POST, PUT, PATCH, and DELETE operations with 100% pass rate.
- 🎨 **Modern Interactive Web UI:** Responsive developer dashboard served statically via Express, featuring a live syllabus tracker and one-click role switching.

---

## 🏗️ System Architecture & Design Patterns

CollabFlow adheres strictly to the **MVC (Model-View-Controller)** pattern and **Layered Separation of Concerns**:

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|   Interactive Web Dashboard (HTML5, CSS3, JS)  /  Postman Client / CLI  |
+-------------------------------------------------------------------------+
                                    │
                               HTTP / WebSocket
                                    ▼
+-------------------------------------------------------------------------+
|                           EXPRESS & HTTP SERVER                         |
|   src/server.js (http.createServer, Socket.IO Server, Static Files)     |
+-------------------------------------------------------------------------+
                                    │
                            Middleware Pipeline
   ┌────────────────────────────────┴─────────────────────────────────┐
   ▼                                                                   ▼
[CORS & Morgan Logging]                                      [Logger Middleware]
   │                                                                   │
   ▼                                                                   ▼
[express.json() Parser]                                      [Centralized Error]
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                               ROUTES TIER                               |
|   /api/v1/auth   │   /api/v1/projects   │   /api/v1/tasks   │   /users  |
+-------------------------------------------------------------------------+
                                    │
                       Route Guard Middlewares
   ┌────────────────────────────────┴─────────────────────────────────┐
   ▼                                                                   ▼
[authenticateJWT (Token Verify)]                            [authorizeRoles (RBAC)]
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                           CONTROLLERS (MVC)                             |
|   Business logic execution, Input validation, Response formatting       |
+-------------------------------------------------------------------------+
             │                                              │
             ▼                                              ▼
+───────────────────────────+                 +───────────────────────────+
|     Node EventEmitter     |                 |       MONGOOSE ODM        |
|  Async Audit Logging &    |                 |   Schemas, Validations,   |
|  Socket.IO Broadcasting   |                 |   Indexes, Relationships  |
+───────────────────────────+                 +───────────────────────────+
                                                            │
                                                            ▼
                                              +───────────────────────────+
                                              |      MONGODB DATABASE     |
                                              |  Users, Projects, Tasks,  |
                                              |       ActivityLogs        |
                                              +───────────────────────────+
```

---

## 📚 Comprehensive 40-Lecture Syllabus Matrix

Every single lecture from the course curriculum is directly implemented in the code as detailed below:

### 🔷 Unit 1: Node.js Runtime & Core Backend Fundamentals

| Lecture | Topic Name | Implementation in CollabFlow | Relevant Source Files |
| :--- | :--- | :--- | :--- |
| **Lecture 1** | **Introduction to Backend Development** | Implemented client-server architecture, JSON request-response lifecycle, stateless REST principles. | [src/server.js](file:///d:/Web%20Dev%20Capstone/src/server.js) |
| **Lecture 2** | **HTTP Fundamentals** | Handled HTTP verbs (GET, POST, PUT, DELETE, PATCH), proper status codes (200, 201, 400, 401, 403, 404, 500), headers. | [src/routes/](file:///d:/Web%20Dev%20Capstone/src/routes), [src/controllers/](file:///d:/Web%20Dev%20Capstone/src/controllers) |
| **Lecture 3** | **Node.js Runtime & NPM** | Configured `package.json`, NPM lifecycle scripts (`start`, `dev`, `cli`, `seed`, `test`), production and dev dependencies. | [package.json](file:///d:/Web%20Dev%20Capstone/package.json) |
| **Lecture 4** | **Node.js Modules** | Structured project using CommonJS modules (`module.exports`, `require`), avoiding global namespace pollution. | Throughout `src/` |
| **Lecture 5** | **Core Node.js Modules** | Utilized `path` (cross-platform path resolution), `fs` (file handling), `os` (hardware telemetry), `http` (HTTP server wrapper). | [cli.js](file:///d:/Web%20Dev%20Capstone/cli.js), [src/config/env.js](file:///d:/Web%20Dev%20Capstone/src/config/env.js) |
| **Lecture 6** | **Process Object & CLI** | Parsed command-line arguments with `process.argv`, accessed `process.env`, handled `process.exit()`, captured `SIGINT` for graceful shutdown. | [cli.js](file:///d:/Web%20Dev%20Capstone/cli.js), [src/server.js](file:///d:/Web%20Dev%20Capstone/src/server.js) |
| **Lecture 7** | **HTTP Server Development** | Built native HTTP server via `http.createServer(app)` to multiplex Express routing and Socket.IO on the same TCP port. | [src/server.js](file:///d:/Web%20Dev%20Capstone/src/server.js) |
| **Lecture 8** | **API Testing & Debugging** | Implemented 15 automated test cases using Node test runner + Supertest; generated complete Postman collection. | [tests/api.test.js](file:///d:/Web%20Dev%20Capstone/tests/api.test.js), [Postman_Collection.json](file:///d:/Web%20Dev%20Capstone/Postman_Collection.json) |

---

### 🔷 Unit 2: Express.js & MVC Architecture

| Lecture | Topic Name | Implementation in CollabFlow | Relevant Source Files |
| :--- | :--- | :--- | :--- |
| **Lecture 9** | **Introduction to Express.js** | Initialized Express app, registered global middleware pipeline, bound routes to port 5000. | [src/server.js](file:///d:/Web%20Dev%20Capstone/src/server.js) |
| **Lecture 10** | **CRUD Fundamentals** | Implemented full Create, Read, Update, and Delete data operations across Projects and Tasks. | [src/controllers/taskController.js](file:///d:/Web%20Dev%20Capstone/src/controllers/taskController.js) |
| **Lecture 11** | **Request & Response Handling** | Extracted URL parameters (`req.params`), search query parameters (`req.query`), JSON payloads (`req.body`), and structured `res.status().json()`. | [src/controllers/](file:///d:/Web%20Dev%20Capstone/src/controllers) |
| **Lecture 12** | **Introduction to MVC Architecture** | Strict architectural separation: Models (`src/models/`), Views (`src/public/`), Controllers (`src/controllers/`). | `src/models`, `src/public`, `src/controllers` |
| **Lecture 13** | **Controllers & Business Logic** | Thin route handlers delegating business validation, model queries, and event emissions to controller functions. | [src/controllers/](file:///d:/Web%20Dev%20Capstone/src/controllers) |
| **Lecture 14** | **CRUD Operations using MVC** | Executed complete MVC CRUD workflow from client request -> controller -> model -> response. | `src/controllers/projectController.js` |
| **Lecture 15** | **Express Routing & REST APIs** | Modular routers using `express.Router()` with versioned REST API prefix (`/api/v1/auth`, `/api/v1/tasks`, etc.). | [src/routes/](file:///d:/Web%20Dev%20Capstone/src/routes) |
| **Lecture 16** | **Middleware Basics** | Application-level middleware (`express.json()`, `cors()`), custom execution duration timer in `loggerMiddleware`. | [src/middlewares/loggerMiddleware.js](file:///d:/Web%20Dev%20Capstone/src/middlewares/loggerMiddleware.js) |
| **Lecture 17** | **Middleware Chaining** | Pipeline chaining: `authenticateJWT` -> `authorizeRoles` -> `validateTask` -> `createTask`. | [src/routes/taskRoutes.js](file:///d:/Web%20Dev%20Capstone/src/routes/taskRoutes.js) |
| **Lecture 18** | **Error Handling** | Operational `AppError` class, centralized 404 handler, and global error handling middleware catching Mongoose CastErrors and duplicate keys. | [src/utils/appError.js](file:///d:/Web%20Dev%20Capstone/src/utils/appError.js), [src/middlewares/errorMiddleware.js](file:///d:/Web%20Dev%20Capstone/src/middlewares/errorMiddleware.js) |

---

### 🔷 Unit 3: Databases & Mongoose ODM

| Lecture | Topic Name | Implementation in CollabFlow | Relevant Source Files |
| :--- | :--- | :--- | :--- |
| **Lecture 19** | **Introduction to Databases (SQL vs NoSQL)** | Utilized NoSQL JSON/BSON document model, comparing flexible schemas and horizontal scalability against relational SQL tables. | Documented in README, implemented via MongoDB |
| **Lecture 20** | **MongoDB Basics & Configuration** | Setup connection supporting both local instance (`mongodb://127.0.0.1:27017`) and remote MongoDB Atlas clusters. | [src/config/db.js](file:///d:/Web%20Dev%20Capstone/src/config/db.js) |
| **Lecture 21** | **MongoDB CRUD Operations** | `Model.create()`, `Model.find()`, `Model.findById()`, `Model.findByIdAndUpdate()`, `Model.findByIdAndDelete()`. | [src/controllers/](file:///d:/Web%20Dev%20Capstone/src/controllers) |
| **Lecture 22** | **Query Operations in MongoDB** | Advanced querying: Case-insensitive search (`$regex`), status filtering, field sorting (`.sort()`), pagination (`.skip()`, `.limit()`). | [src/controllers/taskController.js](file:///d:/Web%20Dev%20Capstone/src/controllers/taskController.js) |
| **Lecture 23** | **Aggregation Pipeline + Indexing** | Multi-stage aggregation (`$match`, `$group`, `$sort`, `$project`, `$lookup`) for project analytics; compound indexes (`{ project: 1, status: 1 }`). | [src/controllers/analyticsController.js](file:///d:/Web%20Dev%20Capstone/src/controllers/analyticsController.js), [src/models/Task.js](file:///d:/Web%20Dev%20Capstone/src/models/Task.js) |
| **Lecture 24** | **Data Modelling & Relationships** | Normalized relational data modelling using Mongoose `ref` references (`User` <-> `Project` <-> `Task`), populated via `.populate()`. | [src/models/](file:///d:/Web%20Dev%20Capstone/src/models) |
| **Lecture 25** | **Mongoose ODM + Schema Design** | Schema definitions with typed attributes (`String`, `Date`, `ObjectId`, `Array`), timestamps, and default values. | [src/models/Project.js](file:///d:/Web%20Dev%20Capstone/src/models/Project.js) |
| **Lecture 26** | **Data Validation using Mongoose** | Built-in validators (`required`, `minlength`, `maxlength`, `enum`) and custom email regex validator. | [src/models/User.js](file:///d:/Web%20Dev%20Capstone/src/models/User.js) |
| **Lecture 27** | **Connecting Node.js with MongoDB** | `mongoose.connect()` in `db.js` with lifecycle event monitoring (`connected`, `error`, `disconnected`). | [src/config/db.js](file:///d:/Web%20Dev%20Capstone/src/config/db.js) |
| **Lecture 28** | **Building REST APIs with DB Integration** | Integrated MongoDB directly into production RESTful endpoints. | [src/routes/](file:///d:/Web%20Dev%20Capstone/src/routes) |

---

### 🔷 Unit 4: Advanced Security, Authentication & Real-Time

| Lecture | Topic Name | Implementation in CollabFlow | Relevant Source Files |
| :--- | :--- | :--- | :--- |
| **Lecture 29** | **Environment Variables** | System-level environment variables via `process.env` guarding port, secrets, and database strings. | [src/config/env.js](file:///d:/Web%20Dev%20Capstone/src/config/env.js) |
| **Lecture 30** | **Config Management & dotenv** | Centralized configuration via `dotenv.config()`, providing `.env` and `.env.example` templates. | [.env](file:///d:/Web%20Dev%20Capstone/.env), [.env.example](file:///d:/Web%20Dev%20Capstone/.env.example) |
| **Lecture 31** | **Authentication** | User identity registration and login verification flows. | [src/controllers/authController.js](file:///d:/Web%20Dev%20Capstone/src/controllers/authController.js) |
| **Lecture 32** | **Authorization Concepts** | Strict separation between Authentication (Identity) and Authorization (Role permissions). | [src/middlewares/rbacMiddleware.js](file:///d:/Web%20Dev%20Capstone/src/middlewares/rbacMiddleware.js) |
| **Lecture 33** | **Password Hashing (bcrypt)** | Cryptographic salt generation and one-way password hashing via `bcryptjs` in Mongoose pre-save hook; secure `comparePassword` method. | [src/models/User.js](file:///d:/Web%20Dev%20Capstone/src/models/User.js) |
| **Lecture 34** | **JWT (JSON Web Tokens)** | Cryptographic token signing and payload verification using `jsonwebtoken`. | [src/utils/tokenHelper.js](file:///d:/Web%20Dev%20Capstone/src/utils/tokenHelper.js) |
| **Lecture 35** | **Access Tokens, Refresh Tokens** | Dual-token security architecture: Short-lived Access Token (15 mins) + Long-lived rotatable Refresh Token (7 days) with revocation. | [src/controllers/authController.js](file:///d:/Web%20Dev%20Capstone/src/controllers/authController.js) |
| **Lecture 36** | **Protected Routes** | `authenticateJWT` middleware verifying Bearer tokens and attaching user context to `req.user`. | [src/middlewares/authMiddleware.js](file:///d:/Web%20Dev%20Capstone/src/middlewares/authMiddleware.js) |
| **Lecture 37** | **RBAC (Role-Based Access Control)** | `authorizeRoles('admin', 'manager')` middleware enforcing least privilege permissions across endpoints. | [src/middlewares/rbacMiddleware.js](file:///d:/Web%20Dev%20Capstone/src/middlewares/rbacMiddleware.js) |
| **Lecture 38** | **EventEmitter** | Custom Node.js `EventEmitter` in `appEmitter.js` dispatching events (`task:created`, `task:status_changed`) to record audit trails in MongoDB. | [src/events/appEmitter.js](file:///d:/Web%20Dev%20Capstone/src/events/appEmitter.js) |
| **Lecture 39** | **Web Sockets** | Bidirectional full-duplex communication over single persistent TCP connection. | [src/server.js](file:///d:/Web%20Dev%20Capstone/src/server.js) |
| **Lecture 40** | **Socket.IO** | Multi-room real-time messaging, typing indicators, and instant task status broadcast synchronization. | [src/sockets/socketHandler.js](file:///d:/Web%20Dev%20Capstone/src/sockets/socketHandler.js) |

---

## 💻 Tech Stack & Dependencies

### Backend Technologies
- **Node.js** (v18+ / v24.14.1) — Asynchronous Event-Driven JavaScript Runtime
- **Express.js** (v4.21.2) — Fast, unopinionated minimalist web framework
- **MongoDB** (v8.2.6) — Document-oriented distributed NoSQL database
- **Mongoose ODM** (v8.9.2) — Object Data Modeling library with schema validation
- **Socket.IO** (v4.8.1) — Real-time bidirectional event-based communication
- **bcryptjs** (v2.4.3) — Cryptographic salt and password hashing library
- **jsonwebtoken** (v9.0.2) — RFC 7519 industry-standard JWT generator and validator
- **dotenv** (v16.4.7) — Environment variable loader
- **morgan** & **cors** — HTTP request logging and Cross-Origin Resource Sharing

### Testing & Development
- **Supertest** (v7.0.0) — High-level HTTP testing abstraction
- **Node Test Runner** (`node:test`, `node:assert`) — Native fast testing framework
- **Nodemon** (v3.1.9) — Development monitor with hot reload

### Frontend (View Tier)
- **HTML5 & Vanilla JavaScript (ES6+)** — Client-side SPA logic with reactive DOM updates
- **CSS3 (Custom Theme)** — Responsive dark-mode dashboard with CSS variables

---

## 📁 Folder & File Directory Structure

```
d:\Web Dev Capstone/
├── package.json                   # Project metadata, NPM scripts & dependencies (L3)
├── .env                           # Environment secrets & database connection (L29, L30)
├── .env.example                   # Environment configuration template (L30)
├── cli.js                         # Custom CLI diagnostic & database seeder tool (L4-L7)
├── Postman_Collection.json        # Exported Postman collection for all REST endpoints (L8)
├── README.md                      # Comprehensive academic documentation (This file)
├── tests/
│   └── api.test.js                # Automated test suite (15/15 tests passing) (L8)
├── src/
│   ├── server.js                  # Express initialization & Socket.IO HTTP server (L1, L7, L9, L39, L40)
│   ├── config/
│   │   ├── env.js                 # Centralized dotenv configuration & validation (L29, L30)
│   │   └── db.js                  # Mongoose MongoDB connection & event monitoring (L20, L27)
│   ├── models/                    # Mongoose Models, Schemas, Indexes & Hooks (L23-L26)
│   │   ├── User.js                # User schema, bcrypt hash hook, JWT refreshTokens (L26, L33, L37)
│   │   ├── Project.js             # Project schema & member relationships (L24, L25)
│   │   ├── Task.js                # Task schema with compound indexes & enums (L23, L26)
│   │   └── ActivityLog.js         # Audit log records populated by EventEmitter (L38)
│   ├── controllers/               # MVC Business Logic Controllers (L12-L14)
│   │   ├── authController.js      # Register, Login, Refresh Token, Logout (L31, L34, L35)
│   │   ├── userController.js      # User management & RBAC role updates (L37)
│   │   ├── projectController.js   # Project CRUD & relationship populations (L10, L14, L21)
│   │   ├── taskController.js      # Task CRUD, filters, pagination, regex search (L10, L22)
│   │   └── analyticsController.js # MongoDB Aggregation Pipeline ($group, $match) (L23)
│   ├── routes/                    # Modular Express REST Routers (L15, L28)
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   ├── userRoutes.js          # User & RBAC endpoints
│   │   ├── projectRoutes.js       # Project endpoints
│   │   ├── taskRoutes.js          # Task endpoints
│   │   └── analyticsRoutes.js     # Analytics endpoints
│   ├── middlewares/               # Express Middleware Pipeline (L16-L18)
│   │   ├── authMiddleware.js      # JWT Bearer token verification (L36)
│   │   ├── rbacMiddleware.js      # Role-Based Access Control gatekeeper (L37)
│   │   ├── validateMiddleware.js  # Request payload body validation (L11, L26)
│   │   ├── loggerMiddleware.js    # Execution timer & HTTP logger (L16)
│   │   └── errorMiddleware.js     # Centralized error handler & 404 handler (L18)
│   ├── events/
│   │   └── appEmitter.js          # Node.js EventEmitter for async events (L38)
│   ├── sockets/
│   │   └── socketHandler.js       # Socket.IO rooms, live chat & task sync (L39, L40)
│   ├── utils/
│   │   ├── appError.js            # Custom operational Error class (L18)
│   │   └── tokenHelper.js         # JWT signing & verification utilities (L34, L35)
│   └── public/                    # Interactive Web Dashboard (MVC View Tier)
│       ├── index.html             # UI with student header, syllabus tracker & demo tabs
│       ├── app.js                 # Client-side API fetch, token refresh & Socket.IO logic
│       └── style.css              # Custom responsive stylesheet
```

---

## ⚙️ Step-by-Step Installation & Setup Guide

### 1. Prerequisites Check
Ensure that **Node.js** and **MongoDB** are installed and running on your system:
```bash
node -v      # Expected: v18.0.0 or higher
npm -v       # Expected: v9.0.0 or higher
mongod --version # Or verify MongoDB service is running
```

### 2. Navigate to Project Directory
```bash
cd "d:\Web Dev Capstone"
```

### 3. Verify Dependencies
Dependencies are already installed. If running on a fresh computer, run:
```bash
npm install
```

### 4. Review Environment File (`.env`)
The `.env` file is pre-configured with default settings:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/collabflow_capstone
JWT_ACCESS_SECRET=collabflow_super_secret_access_jwt_key_2026_anshuman
JWT_REFRESH_SECRET=collabflow_super_secret_refresh_jwt_key_2026_anshuman
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STUDENT_NAME=Anshuman Jha
STUDENT_ROLL=2501010110
```

### 5. Seed Database with Sample Data
Run the custom seeder to populate sample users, projects, and tasks:
```bash
npm run seed
```

### 6. Start the Server
- **Production Mode:**
  ```bash
  npm start
  ```
- **Development Mode (with auto-restart on file change):**
  ```bash
  npm run dev
  ```

Server will output:
```
====================================================
 CollabFlow Capstone Platform running on port 5000
 Student: Anshuman Jha | Roll No: 2501010110
 Environment: development
 Local URL: http://localhost:5000
 Health Check: http://localhost:5000/api/v1/health
====================================================
```

### 7. Open the Web Application
Open your web browser and navigate to:
👉 **`http://localhost:5000`**

---

## 👥 Database Seeding & Default Credentials

When you run `npm run seed`, the database is populated with three ready-to-test accounts across all RBAC privilege levels:

| User Role | Name | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Admin** | Anshuman Jha | `anshuman@example.com` | `Password123!` | Full control: Delete projects, update user roles, create tasks |
| 👔 **Manager** | Neha Sharma | `neha@example.com` | `Password123!` | Create projects, create tasks, assign members, view analytics |
| 💻 **Developer** | Rahul Verma | `rahul@example.com` | `Password123!` | View tasks, update task status (`todo` -> `completed`), send chat |

---

## 📡 Complete REST API Reference

Every endpoint supports clean JSON input and output.

### 1. Health Check (Public)
- **`GET /api/v1/health`**
  - **Description:** Returns server uptime and student capstone metadata.
  - **Response (200 OK):**
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

---

### 2. Authentication Endpoints (`/api/v1/auth`)

#### `POST /api/v1/auth/register` (Public)
- **Request Body:**
  ```json
  {
    "name": "Saurabh Kumar",
    "email": "saurabh@example.com",
    "password": "Password123!",
    "role": "developer"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "data": {
      "user": { "id": "...", "name": "Saurabh Kumar", "email": "saurabh@example.com", "role": "developer" },
      "tokens": { "accessToken": "...", "refreshToken": "..." }
    }
  }
  ```

#### `POST /api/v1/auth/login` (Public)
- **Request Body:**
  ```json
  {
    "email": "anshuman@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):** Returns new `accessToken` (15m) and `refreshToken` (7d).

#### `POST /api/v1/auth/refresh` (Public)
- **Request Body:**
  ```json
  {
    "refreshToken": "<your_refresh_token>"
  }
  ```
- **Response (200 OK):** Returns a fresh `accessToken`.

#### `GET /api/v1/auth/me` (Protected — requires `Bearer <token>`)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (200 OK):** Returns profile of logged-in user.

---

### 3. Project Management Endpoints (`/api/v1/projects`)

#### `GET /api/v1/projects` (Protected)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (200 OK):** List of all projects with populated member and creator details.

#### `POST /api/v1/projects` (Protected — Admin & Manager only)
- **Request Body:**
  ```json
  {
    "name": "AI Collaboration Module",
    "description": "Smart agent integration in project workspace",
    "status": "planning"
  }
  ```
- **Response (201 Created):** Newly created project document.

#### `PUT /api/v1/projects/:id` (Protected — Admin & Manager only)
- **Request Body:** Updates project title, description, or status (`planning`, `in-progress`, `completed`, `on-hold`).
- **Response (200 OK):** Updated project document.

#### `DELETE /api/v1/projects/:id` (Protected — Admin only)
- **Response (200 OK):** `{"status": "success", "message": "Project deleted successfully"}`

---

### 4. Task Management Endpoints (`/api/v1/tasks`)

#### `GET /api/v1/tasks` (Protected — Advanced Queries)
- **Query Parameters:**
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `10`)
  - `status`: Filter by status (`todo`, `in-progress`, `review`, `completed`)
  - `priority`: Filter by priority (`low`, `medium`, `high`, `urgent`)
  - `search`: Keyword search matching task title or description using case-insensitive regex
  - `sort`: Field sorting (e.g. `-createdAt`, `title`)
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "results": 4,
    "pagination": { "total": 4, "page": 1, "pages": 1, "limit": 10 },
    "data": { "tasks": [ ... ] }
  }
  ```

#### `POST /api/v1/tasks` (Protected)
- **Request Body:**
  ```json
  {
    "title": "Build WebSockets Chat Layer",
    "description": "Multiplex Socket.IO over HTTP listener",
    "project": "<project_id>",
    "priority": "high",
    "status": "todo"
  }
  ```
- **Response (201 Created):** Created task + Triggers `task:created` on EventEmitter + Emits Socket.IO notification.

#### `PUT /api/v1/tasks/:id` (Protected)
- **Request Body:**
  ```json
  {
    "status": "completed",
    "priority": "urgent"
  }
  ```
- **Response (200 OK):** Triggers `task:status_changed` event and broadcasts live update to project room.

#### `DELETE /api/v1/tasks/:id` (Protected — Admin & Manager only)
- **Response (200 OK):** Permanently removes task from MongoDB.

---

### 5. Analytics Aggregation Endpoint (`/api/v1/analytics/tasks`)

#### `GET /api/v1/analytics/tasks` (Protected)
- **Description:** Demonstrates MongoDB Aggregation Pipeline using `$match`, `$group`, `$sort`, and `$project`.
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "summary": { "totalTasks": 4, "totalProjects": 2 },
      "statusDistribution": [
        { "status": "completed", "count": 1 },
        { "status": "in-progress", "count": 1 },
        { "status": "todo", "count": 1 },
        { "status": "review", "count": 1 }
      ],
      "priorityDistribution": [
        { "priority": "high", "count": 2 },
        { "priority": "urgent", "count": 1 },
        { "priority": "medium", "count": 1 }
      ]
    }
  }
  ```

---

### 6. User Management Endpoint (`/api/v1/users`)

#### `PATCH /api/v1/users/:id/role` (Protected — Admin only)
- **Request Body:** `{"role": "manager"}`
- **Response (200 OK):** Updates user role in database enforcing RBAC.

---

## ⚡ Real-Time Collaboration & WebSockets

CollabFlow pairs **Node.js EventEmitter (Lecture 38)** with **Socket.IO (Lectures 39 & 40)**:

```
┌────────────────────────────────────────────────────────┐
│               Task Controller Action                  │
│       (e.g., Task Created or Status Changed)           │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
   [Node.js EventEmitter]         [Socket.IO Server]
   src/events/appEmitter.js      src/sockets/socketHandler.js
             │                           │
             ▼                           ▼
  Asynchronous Database Log      Real-Time Broadcast
    (src/models/ActivityLog)    (io.to("project:<id>").emit)
                                         │
                                         ▼
                               [Connected Web Clients]
                                Instant UI Board Refresh
```

### Supported Socket Events:
1. `join:room` — Joins a dedicated project collaboration room.
2. `chat:message` — Sends message to room members.
3. `chat:broadcast` — Receives real-time message bubble.
4. `notification` — Triggered automatically whenever tasks are created or updated.

---

## 🛠️ CLI Utility & System Diagnostics (`cli.js`)

Demonstrating **Lectures 4, 5, 6, and 7**, the project contains an independent Command-Line Interface executable via Node:

### 1. System Diagnostics (`--info`)
```bash
npm run cli
```
**Output:**
- Operating System & Kernel version via `os.type()` & `os.release()`
- CPU cores count via `os.cpus().length`
- Real-time Free and Total RAM via `os.freemem()`
- Current Node.js runtime version and Process ID (`process.pid`)

### 2. Database Seeding (`--seed`)
```bash
npm run seed
```
Clears existing collections and inserts clean default datasets with hashed passwords.

### 3. Server HTTP Probe (`--ping`)
```bash
node cli.js --ping
```
Uses Node's native `http.get` core module to probe `http://localhost:5000/api/v1/health` and verify server response without third-party dependencies.

---

## 🧪 Automated API Testing Suite (`tests/api.test.js`)

Demonstrating **Lecture 8 (API Testing & Debugging)**, the project features a comprehensive test suite using Node's built-in Test Runner and **Supertest**.

Run the test suite:
```bash
npm test
```

### Test Coverage (15 Assertions across all HTTP Verbs):
1. `GET /api/v1/health` — Returns 200 and student metadata.
2. `POST /api/v1/auth/login` — Verifies valid credentials and issues JWT Access & Refresh tokens.
3. `POST /api/v1/auth/register` — Creates new user with hashed password.
4. `POST /api/v1/auth/refresh` — Validates refresh token and returns fresh access token.
5. `POST /api/v1/projects` — Creates new project in MongoDB.
6. `GET /api/v1/projects` — Retrieves project list with populated references.
7. `POST /api/v1/tasks` — Creates task, triggers EventEmitter, and emits socket event.
8. `GET /api/v1/tasks/:id` — Fetches single task by ObjectId.
9. `PUT /api/v1/tasks/:id` — Updates task status and priority.
10. `PUT /api/v1/projects/:id` — Updates project status.
11. `PATCH /api/v1/users/:id/role` — Demonstrates RBAC role modification.
12. `GET /api/v1/analytics/tasks` — Validates MongoDB Aggregation Pipeline output.
13. `DELETE /api/v1/tasks/:id` — Permanently removes task and verifies 404 on subsequent get.
14. `DELETE /api/v1/projects/:id` — Removes project.

**Execution Result:**
```
✔ CollabFlow Full HTTP Methods Test Suite (GET, POST, PUT, PATCH, DELETE) (502ms)
ℹ tests 15 | pass 15 | fail 0 | cancelled 0
```

---

## 🖥️ Web Dashboard & User Interface Walkthrough

When you open **`http://localhost:5000`**, you are presented with:

1. **Header Banner:** Prominently displays:
   - Student Name: **Anshuman Jha**
   - Roll No: **2501010110**
   - Course: **Web Development Capstone**
2. **Tab 1: Syllabus Matrix (Lectures 1 - 40):** A complete visual syllabus checklist mapping every lecture to code with checkmarks.
3. **Tab 2: Project & Tasks (CRUD Board):**
   - Search bar with live debounced regex query
   - Filter dropdowns by status and priority
   - Sorting options
   - Inline status updater dropdown
   - Delete task button
   - "+ Create New Task" modal
4. **Tab 3: MongoDB Analytics:**
   - Real-time KPI cards (Total Projects, Total Tasks, Completed Tasks)
   - Status Distribution bars computed via `$group`
   - Priority Distribution breakdown
5. **Tab 4: Real-Time Collab (Socket.IO):**
   - Project chat room selector
   - Real-time message stream with sender roles
   - Live activity notification feed triggered by background events
6. **Quick 1-Click Login:**
   - Instant 1-click switch between **Admin (Anshuman Jha)**, **Manager (Neha)**, and **Developer (Rahul)** to immediately demo RBAC privilege enforcement to your professor!

---


## 📜 Conclusion & Acknowledgements

This project was engineered to deliver a complete, robust, and extensible web application that satisfies every requirement of the academic curriculum.

- **Developer:** Anshuman Jha
- **Roll Number:** 2501010110
- **Submission Date:** November 2026
#   w e b d e v - I I I - C a p s t o n e  
 