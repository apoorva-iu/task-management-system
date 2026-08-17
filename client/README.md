# 🚀 TaskFlow — Full-Stack Task Operations & Management Platform

A production-ready, full-stack Task Management platform built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. It provides secure user authentication, user workspace isolation via JSON Web Tokens (JWT), interactive statistical metrics, a glassmorphic dashboard interface, multi-category organization, real-time multi-criteria filtering, and complete task lifecycle management.

---

## 🌐 Live Deployment & Links

- **Live Application (Frontend):** https://taskflow-apoorva.netlify.app
- **Live REST API (Backend):** https://taskflow-backend-qsva.onrender.com
- **GitHub Repository:** https://github.com/apoorva-iu/task-management-system

---

## ✨ Key Features

- 🔐 **User Authentication & Workspace Isolation:** Secure registration and login workflows with `bcryptjs` password encryption and stateless `JWT` session tokens. Users only view and manage their own task pipeline.
- 📊 **Real-Time Task Operations Dashboard:** Live counters displaying Total Tasks, To Do, In Progress, and Completed distributions.
- 🗂️ **Task Lifecycle Management (CRUD):** Complete support to create new tasks, update titles/notes in place, transition lifecycle stages, and delete records.
- 🏷️ **Multi-Category Organization:** Structured categorization across `Work`, `Personal`, `Study`, and `Urgent` classifications.
- ⚡ **Dynamic Multi-Criteria Search & Filtering:** Instant client-side search by title keywords alongside simultaneous filtering by category and completion status.
- 🎨 **Modern Glassmorphic UI:** Ambient neon glow background, backdrop-filtered glass containers, responsive layouts, and reactive action states.

---

## 🛠️ Tech Stack

| Layer          | Technologies                              |
| -------------- | ----------------------------------------- |
| **Frontend**   | React.js, Vite, Axios, Vanilla CSS        |
| **Backend**    | Node.js, Express.js, JWT, Bcrypt.js, CORS |
| **Database**   | MongoDB Atlas, Mongoose ODM               |
| **Deployment** | Netlify, Render                           |

---

## 🗄️ Database Schema Design

### 1. User Schema

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### 2. Task Schema

```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Study', 'Urgent'],
    default: 'Work'
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Completed'],
    default: 'Todo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

# 📡 API Documentation

## 🔐 Authentication — `/api/auth`

| Method | Endpoint             | Description                            | Access    |
| ------ | -------------------- | -------------------------------------- | --------- |
| `POST` | `/api/auth/register` | Register a new user account            | 🌐 Public |
| `POST` | `/api/auth/login`    | Authenticate user and return JWT token | 🌐 Public |

---

## 📋 Task Management — `/api/tasks`

| Method   | Endpoint         | Description                                        | Access          |
| -------- | ---------------- | -------------------------------------------------- | --------------- |
| `GET`    | `/api/tasks`     | Retrieve all tasks owned by the authenticated user | 🔒 JWT Required |
| `POST`   | `/api/tasks`     | Create a new task in the user's pipeline           | 🔒 JWT Required |
| `PUT`    | `/api/tasks/:id` | Update task details or lifecycle status            | 🔒 JWT Required |
| `DELETE` | `/api/tasks/:id` | Permanently delete a task item                     | 🔒 JWT Required |

---

## 🔑 Authentication Flow

```text
User
  │
  ├── Register
  │      ↓
  │   Password Hashing
  │      ↓
  │   MongoDB
  │
  └── Login
         ↓
      JWT Token
         ↓
   Authenticated Requests
         ↓
      Task APIs
         ↓
      User's Tasks
```

---

## 🔒 Security

TaskFlow implements several security measures:

- Passwords are encrypted using **bcryptjs**
- Authentication is handled using **JSON Web Tokens (JWT)**
- Protected task routes require a valid JWT
- Users can only access their own tasks
- MongoDB ObjectId references provide user-task ownership
- CORS is configured for frontend/backend communication
- Stateless authentication eliminates server-side session storage

---

## 📊 Task Lifecycle

```text
             ┌──────────────┐
             │     Todo     │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │  In Progress │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │   Completed  │
             └──────────────┘
```

---

## 🗂️ Task Categories

| Category        | Purpose                                           |
| --------------- | ------------------------------------------------- |
| 💼 **Work**     | Professional and work-related tasks               |
| 👤 **Personal** | Personal activities and responsibilities          |
| 📚 **Study**    | Academic and learning-related tasks               |
| 🚨 **Urgent**   | High-priority tasks requiring immediate attention |

---

## 🔍 Search & Filtering

TaskFlow supports multiple filtering options:

| Feature                   | Description                                |
| ------------------------- | ------------------------------------------ |
| 🔎 **Search**             | Search tasks by title keywords             |
| 🏷️ **Category**           | Filter by Work, Personal, Study, or Urgent |
| 📌 **Status**             | Filter by Todo, In Progress, or Completed  |
| ⚡ **Combined Filtering** | Apply multiple filters simultaneously      |

---

## 🏗️ Application Architecture

```text
┌──────────────────────────────┐
│          React.js            │
│        Frontend / UI         │
└──────────────┬───────────────┘
               │
               │ Axios / REST API
               ▼
┌──────────────────────────────┐
│        Express.js            │
│         REST API             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Node.js             │
│    Authentication & Logic    │
└──────────────┬───────────────┘
               │
               │ Mongoose
               ▼
┌──────────────────────────────┐
│       MongoDB Atlas          │
│       Task & User Data       │
└──────────────────────────────┘
```

---

## 🚀 Deployment

| Component    | Platform      |
| ------------ | ------------- |
| **Frontend** | Netlify       |
| **Backend**  | Render        |
| **Database** | MongoDB Atlas |

---

## 📁 Project Structure

```text
task-management-system/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── README.md
└── package.json
```

---

## 🎯 Project Highlights

- Full-stack MERN application
- Secure JWT authentication
- Password hashing with bcryptjs
- User-specific task isolation
- Complete CRUD operations
- MongoDB Atlas database integration
- RESTful API architecture
- Real-time dashboard statistics
- Multi-category task organization
- Multi-criteria search and filtering
- Responsive glassmorphic interface
- Production deployment using Netlify and Render

---

## 🌐 Project Links

| Resource                 | Link                                                 |
| ------------------------ | ---------------------------------------------------- |
| 🌐 **Live Application**  | https://taskflow-apoorva.netlify.app                 |
| ⚙️ **Backend API**       | https://taskflow-backend-qsva.onrender.com           |
| 💻 **GitHub Repository** | https://github.com/apoorva-iu/task-management-system |

---

## 👩‍💻 Author

**Apoorva I U**

Computer Science & Engineering

---

⭐ If you found this project useful, consider giving the repository a star!
