<div align="center">

# 🚀 Amdox ERP System

### *Full-Stack Enterprise Resource Planning Platform built with the MERN Stack*

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://amdox-erp-system.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[**🌐 Live Demo**](https://amdox-erp-system.vercel.app/) • [**📦 GitHub Repository**](https://github.com/Patelabhishek01/amdox-erp-system)

---

</div>

A full-stack Enterprise Resource Planning (ERP) application built with the MERN stack, focused on modular business workflows, role-based access control, employee self-service (ESS), and project/task management.

> **Primary Focus:** HR and Project Management, with additional ERP modules organized as a scalable platform for future enterprise extensions.

---

## 🌟 Features & Modules

### 🔑 Authentication & Authorization
- **JWT Authentication:** Secure token-based session handling.
- **Protected Routes:** Route guards on both frontend and backend.
- **Role-Based Access Control (RBAC):** Admin, Manager, Employee roles.
- **User-to-Employee Mapping:** Seamless link between system users and employee records.
- **Role-Aware Dashboards:** Customized interfaces tailored to user permission level.

### 👥 HR Management
- **Employee Management:** Complete employee lifecycle & profiles.
- **Attendance Management:** Tracking clock-ins, clock-outs, and daily logs.
- **Leave Management:** Leave applications, manager approvals & tracking.
- **Payroll Management:** Salary slips, deductions, and payment records.
- **Employee Self-Service (ESS):** Personalized portal for leaves, tasks, and profile updates.

### 📋 Project Management
- **Project CRUD:** Create, read, update, and manage project lifecycles.
- **Team Assignment:** Assign Project Managers and multi-select Team Members.
- **Project Tracking:** Real-time priority, status, and target due dates.
- **Task CRUD & Assignment:** Assign tasks to team members with working-hours logging.
- **Leave Conflict Prevention:** Smart validation checks approved employee leaves during task assignment.
- **Real-Time Notifications:** Socket.IO alerts for project and task assignments.

### 💼 Additional ERP Modules
- 💰 **Finance:** Expense tracking & financial management.
- 📦 **Inventory:** Product catalog & stock level tracking.
- 📈 **Sales:** Customer management & sales records.
- 🛒 **Purchase:** Vendor management & purchase order workflows.
- 🤝 **CRM:** Lead management & customer relationship tracking.
- 🎧 **Help Desk:** Support ticket management & issue resolution.
- 🏢 **Asset Management:** Tracking company equipment & allocations.
- 👔 **Recruitment:** Candidate pipelines & hiring workflows.
- 📊 **Analytics:** Module-wise interactive dashboards & business KPIs.

---

## 🔄 HR ↔ Project Integration Architecture

### Core Data Model
```
User ──► Employee ──┬──► Leave
                    └──► Project ──► Task
```
- **Project.projectManager** → `Employee`
- **Project.teamMembers** → `Employee[]`
- **Task.projectId** → `Project`
- **Task.assignedEmployeeId** → `Employee`
- **Leave.employee** → `Employee`

### Integration Highlights
- Projects and tasks strictly reference validated Employee documents.
- Backend enforces **team membership validation** before task assignment.
- **Approved leave checks** warn or prevent assigning tasks during employee leaves.
- Persistent & real-time notifications notify employees immediately upon assignment.

---

## 🏗️ System Architecture

```
                 ┌───────────────────────────┐
                 │       React + Vite        │
                 └─────────────┬─────────────┘
                               │ Axios / REST
                               ▼
                 ┌───────────────────────────┐
                 │      Node + Express       │
                 └──────┬─────────────┬──────┘
       JWT / RBAC       │             │       Socket.IO
                        ▼             ▼
                 ┌──────────────┬────────────┐
                 │   Mongoose   │ Notifications│
                 └──────┬───────┴────────────┘
                        ▼
                 ┌───────────────────────────┐
                 │         MongoDB           │
                 └───────────────────────────┘
```

---

## 📂 Project Structure

```
amdox-erp-system/
├── Client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── component/           # Layouts, UI Components, Header
│   │   ├── modules/             # Auth, HR, Project, Sales, ESS, etc.
│   │   ├── services/            # Axios API Services
│   │   ├── styles/              # Global CSS & Design System
│   │   └── App.jsx              # Main Router & Toast Container
│   ├── package.json
│   └── vite.config.js
│
├── Server/                      # Node.js Express Backend
│   ├── config/                  # DB Connection
│   ├── middleware/              # Auth, RBAC, Rate Limit, Error Handlers
│   ├── modules/                 # Modular Controllers, Models & Routes
│   │   ├── auth/                # Auth & User models
│   │   ├── hr/                  # Employee, Leave, Attendance, Payroll
│   │   ├── project/             # Project & Task Controllers/Models
│   │   └── ...                  # Finance, Inventory, Sales, CRM, etc.
│   ├── routes/                  # Express Router Endpoints
│   ├── server.js                # Express App Initialization
│   └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 19** | Core UI library |
| **Vite** | Lightning-fast build tool |
| **React Router v7** | Single Page Application (SPA) routing |
| **Axios** | HTTP client for API requests |
| **Lucide React / React Icons** | Clean UI icons |
| **Recharts** | Interactive charts and analytics |
| **React Toastify** | User feedback notifications |
| **Socket.IO Client** | Real-time websocket communication |
| **jsPDF & AutoTable** | PDF invoice & report generation |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express v5** | Server-side environment & web framework |
| **Mongoose & MongoDB** | NoSQL database & object modeling |
| **JWT & BcryptJS** | Authentication & password hashing |
| **Socket.IO** | WebSocket server for real-time alerts |
| **Helmet & Rate Limit** | Security headers & request rate limiting |
| **Multer** | Multipart form data & file uploads |

---

## 📡 Key API Endpoints

### 📋 Projects (`/api/projects`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch all projects (Searchable) |
| `GET` | `/api/projects/me` | Fetch projects assigned to logged-in user |
| `GET` | `/api/projects/:id` | Get single project details |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/:id` | Update project details |
| `DELETE` | `/api/projects/:id` | Delete a project |

### 📌 Tasks (`/api/projects/tasks`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects/tasks` | Get all tasks |
| `GET` | `/api/projects/tasks/me` | Get tasks assigned to logged-in employee |
| `POST` | `/api/projects/tasks` | Create a new task |
| `PUT` | `/api/projects/tasks/:id` | Edit task details |
| `PATCH` | `/api/projects/tasks/:id/status` | Update task status (Pending / In Progress / Done) |
| `PATCH` | `/api/projects/tasks/:id/log-hours` | Log working hours on task |
| `DELETE` | `/api/projects/tasks/:id` | Delete a task |

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js** (v18+) & **npm**
- **MongoDB** instance (Local or MongoDB Atlas)

### 1. Clone Repository
```bash
git clone https://github.com/Patelabhishek01/amdox-erp-system.git
cd amdox-erp-system
```

### 2. Backend Setup (`/Server`)
```bash
cd Server
npm install
```
Create a `.env` file inside `/Server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start server:
```bash
npm dev
```
*(Backend runs at `http://localhost:5000`)*

### 3. Frontend Setup (`/Client`)
In a new terminal tab:
```bash
cd Client
npm install
npm run dev
```
*(Frontend runs at `http://localhost:5173`)*

---

## 🚀 Deployment

- **Frontend (Vercel):** Deployed with SPA rewrite rule (`/((?!api/).*)` $\rightarrow$ `/index.html`) to support direct React Router navigation.
- **Backend (Render):** Express API running with environment-configured `VITE_API_URL` pointing to Render.

---

## 👤 Author

**Abhishek Patidar**  
- GitHub: [@Patelabhishek01](https://github.com/Patelabhishek01)

---

<div align="center">
  <sub>Built with ❤️ for scalable enterprise solutions.</sub>
</div>
