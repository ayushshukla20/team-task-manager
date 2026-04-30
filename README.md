# ✦ TaskFlow — Team Task Manager

A full-stack web application for team project management and task tracking with role-based access control (Admin / Member).

Built with **React 19**, **Express 5**, **PostgreSQL**, and **Sequelize ORM**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Role-Based Access Control](#-role-based-access-control)
- [Application Workflow](#-application-workflow)
- [Screenshots](#-screenshots)

---

## ✨ Features

### Authentication
- User registration with role selection (Admin / Member)
- Secure login with JWT token-based authentication
- Password hashing using bcryptjs
- Persistent sessions via localStorage

### Project Management
- Create, view, and manage projects (Admin only)
- Add / remove team members to projects by email
- View all projects you own or are a member of

### Task Management
- Create tasks with title, description, priority, due date, and assignee (Admin only)
- Update task status: **To Do** → **In Progress** → **Done**
- Filter tasks by status (All / To Do / In Progress / Done)
- Assign tasks to any registered user
- Priority levels: Low, Medium, High
- Overdue task detection based on due dates

### Dashboard
- Real-time summary statistics:
  - Total Tasks
  - To Do count
  - In Progress count
  - Completed count
  - Overdue count
- Recent tasks grid with status and priority badges
- Quick navigation to projects and task details

### Role-Based Access Control (RBAC)
| Action | Admin | Member |
|--------|:-----:|:------:|
| Create projects | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| Edit all task fields | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks only) |
| View dashboard | ✅ (all tasks) | ✅ (assigned tasks) |
| View projects | ✅ (all) | ✅ (member of) |

### UI/UX
- Premium dark theme with glassmorphism design
- Violet-to-cyan gradient accents
- Animated background effects on auth pages
- Micro-animations: hover lifts, badge pulses, page transitions
- Responsive sidebar with collapse toggle
- Toast notifications for all actions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router v7, Vanilla CSS |
| **Backend** | Express 5, Node.js |
| **Database** | PostgreSQL with Sequelize ORM |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | express-validator |
| **HTTP Client** | Axios with interceptors |
| **Icons** | react-icons (Material Design) |
| **Notifications** | react-hot-toast |

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize PostgreSQL connection
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── role.js              # Role-based authorization middleware
│   ├── models/
│   │   ├── index.js             # Model associations & exports
│   │   ├── User.js              # User model (name, email, password, role)
│   │   ├── Project.js           # Project model (name, description, owner)
│   │   └── Task.js              # Task model (title, status, priority, etc.)
│   ├── routes/
│   │   ├── auth.js              # Register, Login, Get Profile
│   │   ├── projects.js          # CRUD projects + member management
│   │   ├── tasks.js             # CRUD tasks + dashboard summary
│   │   └── users.js             # List all users
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.png         # TaskFlow logo
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Sidebar + content wrapper
│   │   │   ├── Modal.jsx        # Reusable modal overlay
│   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   ├── StatCard.jsx     # Dashboard stat card
│   │   │   └── TaskCard.jsx     # Task display card
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # Dashboard with stats
│   │   │   ├── Projects.jsx     # Project list
│   │   │   ├── ProjectDetail.jsx # Project detail + tasks
│   │   │   └── TaskDetail.jsx   # Task view/edit
│   │   ├── api.js               # Axios instance with interceptors
│   │   ├── App.jsx              # React Router setup
│   │   ├── main.jsx             # App entry point
│   │   └── index.css            # Global design system
│   ├── index.html
│   ├── vite.config.js           # Vite config with API proxy
│   └── package.json
│
└── README.md
```

---

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) — [Download](https://www.postgresql.org/download/)
- **pgAdmin 4** (recommended for database management) — comes with PostgreSQL installer

---

## 🚀 Installation & Setup

### 1. Clone / Navigate to the Project

```bash
cd team-task-manager
```

### 2. Set Up the Database

Open **pgAdmin 4** and create a new database:

1. Right-click on **Databases** → **Create** → **Database...**
2. Name it `team_task_manager`
3. Click **Save**

> **Note:** You do NOT need to create tables manually. Sequelize auto-creates all tables when the backend starts.

### 3. Configure Environment Variables

Edit `backend/.env` with your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=team_task_manager
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=teamtask_secret_key_2026
```

### 4. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

You need **two terminals** — one for the backend and one for the frontend.

### Terminal 1 — Start Backend (Port 5000)

```bash
cd backend
npx nodemon server.js
```

Expected output:
```
PostgreSQL Connection has been established successfully.
All models were synchronized successfully.
Server running on port 5000
```

### Terminal 2 — Start Frontend (Port 5173)

```bash
cd frontend
npm run dev
```

Then open your browser to: **http://localhost:5173**

> ⚠️ **Important:** Always start the backend FIRST. The frontend proxies API requests to `localhost:5000`, so the backend must be running.

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT token | ❌ |
| GET | `/api/auth/me` | Get current user profile | ✅ |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (both):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Projects (`/api/projects`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/projects` | Create project | Admin |
| GET | `/api/projects` | List projects | Authenticated |
| GET | `/api/projects/:id` | Get project detail | Authenticated |
| POST | `/api/projects/:id/members` | Add member by email | Admin |

---

### Tasks (`/api/tasks`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/tasks` | Create task | Admin |
| GET | `/api/tasks` | List tasks (filterable) | Authenticated |
| GET | `/api/tasks/:id` | Get single task | Authenticated |
| PUT | `/api/tasks/:id` | Update task | Admin or Assignee |
| DELETE | `/api/tasks/:id` | Delete task | Admin |
| GET | `/api/tasks/dashboard/summary` | Get stats summary | Authenticated |

**Query Params for GET `/api/tasks`:**
- `projectId` — Filter by project
- `status` — Filter by status (`todo`, `in-progress`, `done`)
- `priority` — Filter by priority (`low`, `medium`, `high`)

---

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List all users | Authenticated |

---

## 🗄 Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (bcrypt hashed) |
| role | ENUM('admin','member') | DEFAULT 'member' |
| createdAt | TIMESTAMP | Auto-generated |
| updatedAt | TIMESTAMP | Auto-generated |

### Projects Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | Nullable |
| ownerId | INTEGER | FK → Users(id), NOT NULL |
| createdAt | TIMESTAMP | Auto-generated |
| updatedAt | TIMESTAMP | Auto-generated |

### Tasks Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | Nullable |
| status | ENUM('todo','in-progress','done') | DEFAULT 'todo' |
| priority | ENUM('low','medium','high') | DEFAULT 'medium' |
| projectId | INTEGER | FK → Projects(id), NOT NULL |
| assignedTo | INTEGER | FK → Users(id), Nullable |
| createdBy | INTEGER | FK → Users(id), NOT NULL |
| dueDate | DATE | Nullable |
| createdAt | TIMESTAMP | Auto-generated |
| updatedAt | TIMESTAMP | Auto-generated |

### ProjectMembers Table (Join Table)
| Column | Type | Constraints |
|--------|------|-------------|
| projectId | INTEGER | FK → Projects(id) |
| userId | INTEGER | FK → Users(id) |
| createdAt | TIMESTAMP | Auto-generated |
| updatedAt | TIMESTAMP | Auto-generated |

### Entity Relationships
```
User (1) ──── owns ────▶ (N) Project
User (M) ◀── member ──▶ (N) Project  [via ProjectMembers]
Project (1) ── has ────▶ (N) Task
User (1) ──── assigned ─▶ (N) Task
User (1) ──── created ──▶ (N) Task
```

---

## 🔐 Role-Based Access Control

### Admin
- Full access to create, edit, and delete projects and tasks
- Can add/remove members to projects
- Sees all tasks across all projects on the dashboard
- Can reassign tasks and change any task field

### Member
- Can view projects they are added to
- Can view tasks assigned to them
- Can update the **status** of their own assigned tasks only
- Dashboard shows only tasks assigned to them
- Cannot create/delete projects or tasks

---

## 🔄 Application Workflow

### Getting Started (First-Time Setup)

```
1. Start Backend  →  Creates all database tables automatically
2. Start Frontend →  Opens at http://localhost:5173
3. Register       →  Create an Admin account first
4. Login          →  Redirects to Dashboard
```

### Admin Workflow

```
Register as Admin
       │
       ▼
   Dashboard ──────── View task statistics
       │
       ▼
 Create Project ───── Name + Description
       │
       ▼
  Add Members ─────── Invite by email
       │
       ▼
  Create Tasks ────── Title, Description, Priority, Due Date, Assignee
       │
       ▼
  Track Progress ──── Monitor status changes on Dashboard
```

### Member Workflow

```
Register as Member
       │
       ▼
  Get Added ────────── Admin adds you to a project
       │
       ▼
   Dashboard ──────── View your assigned tasks & stats
       │
       ▼
  View Project ────── See project tasks assigned to you
       │
       ▼
  Update Status ───── To Do → In Progress → Done
```

### Task Lifecycle

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│  To Do   │ ──▶ │ In Progress  │ ──▶ │   Done   │
│  (Gray)  │     │   (Cyan)     │     │ (Green)  │
└──────────┘     └──────────────┘     └──────────┘
                                            │
                     Overdue? ◀─────────────┘
                   (Red border)        (if past due date
                                      and not done)
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0f0f1a` | Page background |
| `--surface` | `#1a1a2e` | Card / panel backgrounds |
| `--accent` | `#7c3aed` | Primary violet accent |
| `--accent-cyan` | `#06b6d4` | Secondary cyan accent |
| `--gradient` | `violet → cyan` | Buttons, badges, highlights |
| `--text` | `#e2e8f0` | Primary text |
| `--text-secondary` | `#94a3b8` | Secondary / muted text |
| Font | Inter | Google Fonts |

---

## 🧪 Testing the API (Optional)

You can test the backend APIs independently using **Postman** or **curl**:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@test.com","password":"123456","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

# Create Project (use token from login response)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"My Project","description":"First project"}'
```

---

## 🚀 Deployment on Railway

This project is pre-configured for **Railway** deployment as a single service (backend serves the frontend build).

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Team Task Manager"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

### Step 2 — Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `team-task-manager` repository
4. Railway will auto-detect the `nixpacks.toml` config

### Step 3 — Add PostgreSQL Database

1. In your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway auto-creates a `DATABASE_URL` variable and links it to your service
3. No manual database setup needed — Sequelize auto-creates tables on first run

### Step 4 — Set Environment Variables

In your Railway service, go to **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `your_strong_secret_here` |
| `DATABASE_URL` | *(auto-set by Railway PostgreSQL)* |
| `PORT` | *(auto-set by Railway)* |

> **Note:** `DATABASE_URL` and `PORT` are automatically provided by Railway. You only need to manually add `NODE_ENV` and `JWT_SECRET`.

### Step 5 — Deploy

Railway auto-deploys on every push to `main`. The build process:

```
1. Install backend dependencies  (cd backend && npm install)
2. Install frontend dependencies (cd frontend && npm install)
3. Build frontend               (cd frontend && npm run build)
4. Start backend in production   (cd backend && NODE_ENV=production node server.js)
```

The backend serves the React build files from `frontend/dist/` in production mode.

### Step 6 — Get Your URL

1. Go to **Settings** → **Networking** → **Generate Domain**
2. Your app is live at `https://your-app.up.railway.app`

### Architecture on Railway

```
┌─────────────────────────────────────────┐
│              Railway Service             │
│                                         │
│   Express Server (port from Railway)    │
│   ├── /api/*  → REST API routes         │
│   └── /*      → serves frontend/dist/   │
│                                         │
│              ┌──────────┐               │
│              │ PostgreSQL│               │
│              │ (Railway) │               │
│              └──────────┘               │
└─────────────────────────────────────────┘
```

---

## 📝 License

This project is for educational purposes as part of a Full-Stack Development assignment.
