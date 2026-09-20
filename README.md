#Amdox ERP System

A full-stack Enterprise Resource Planning (ERP) application built with the MERN stack, focused on modular business workflows, role-based access, employee self-service, and project/task management.

Primary implementation focus: HR and Project Management, with additional ERP modules organized as a modular platform for future extension.

#Live Demo

Frontend: https://amdox-erp-system.vercel.app/

Repository: https://github.com/Patelabhishek01/amdox-erp-system

Features

Authentication & Authorization

JWT authentication

Protected routes

Role-based access control

User-to-Employee relationship

Role-aware dashboards and module access

HR Management

Employee management

Attendance management

Leave management

Payroll management

Employee self-service

Profile management

Project Management

Project CRUD

Project manager and team-member assignment

Project status, priority and due-date tracking

Task CRUD

Employee task assignment

Task status updates

Working-hours logging

Employee-specific project and task views

HR ↔ Project Integration

Core relationship:

User
  ↓
Employee
  ├── Leave
  └── Project
        ↓
       Task

Projects and tasks use MongoDB references to employees.

The backend also supports:

Employee-specific project/task access

Project team membership validation

Approved-leave conflict checking during task assignment

Persistent project-assignment notifications

Persistent task-assignment notifications

Real-time notifications with Socket.IO

Additional ERP Modules

The repository also contains modular workflows/pages for:

Finance

Inventory

Sales

Purchase

CRM

Help Desk

Asset Management

Recruitment

Analytics dashboards

Settings

Admin/User management

Tech Stack

Frontend

React 19

Vite

React Router

Axios

React Icons

Lucide React

Recharts

React Toastify

jsPDF / jsPDF AutoTable

Socket.IO Client

Global CSS

Backend

Node.js

Express.js

Mongoose

JWT

bcryptjs

Socket.IO

Helmet

Express Rate Limit

CORS

dotenv

Multer

Database

MongoDB / MongoDB Atlas

Architecture

                    React + Vite
                         │
                    Axios / REST
                         │
                  Node + Express
                    /          \
                 JWT/RBAC     Socket.IO
                    │          │
                    └────┬─────┘
                         │
                      Mongoose
                         │
                      MongoDB

Core Data Model

Employee
   │
   ├──────────────► Project
   │                   │
   │                   └──────────► Task
   │
   └──────────────► Leave

Project.projectManager → Employee

Project.teamMembers → Employee[]

Task.projectId → Project

Task.assignedEmployeeId → Employee

Leave.employee → Employee

Project Structure

amdox-erp-system/
│
├── Client/
│   ├── src/
│   │   ├── component/
│   │   ├── modules/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Server/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── hr/
│   │   ├── finance/
│   │   ├── inventory/
│   │   ├── sales/
│   │   ├── purchase/
│   │   ├── crm/
│   │   ├── project/
│   │   ├── helpdesk/
│   │   ├── asset/
│   │   ├── recruitment/
│   │   └── ess/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md

Getting Started

Prerequisites

Node.js 18+

npm

MongoDB Atlas or MongoDB

Git

1. Clone

git clone https://github.com/Patelabhishek01/amdox-erp-system.git
cd amdox-erp-system

2. Backend

cd Server
npm install

Create Server/.env:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

Start:

npm start

Backend:

http://localhost:5000

3. Frontend

In another terminal:

cd Client
npm install
npm run dev

Vite normally starts at:

http://localhost:5173

4. Production API

For deployment, configure the frontend API base URL to the deployed backend URL. Do not use localhost:5000 in the production frontend.

Never expose MONGO_URI or JWT_SECRET in frontend code.

Authentication Flow

Login
  ↓
Credential validation
  ↓
JWT generated
  ↓
Frontend stores token
  ↓
Authorization: Bearer <token>
  ↓
JWT verification
  ↓
Role / ownership checks
  ↓
Controller
  ↓
MongoDB

Project & Task Workflow

Project Assignment

Admin / Project Manager
        ↓
Select Project Manager
        ↓
Select Team Members
        ↓
Create / Update Project
        ↓
MongoDB
        ↓
Employee notification

Task Assignment

Project
   ↓
Create / Edit Task
   ↓
Select Employee
   ↓
Backend validation
   ├── Project exists
   ├── Team membership
   └── Approved leave conflict
   ↓
Task saved
   ↓
Employee notification

Employee Self-Service

Authenticated employees can access their associated:

Projects

Tasks

Task status

Working hours

Leave information

Profile information

Employee identity is resolved from the authenticated user/employee relationship instead of trusting an arbitrary employee ID from the frontend.

Notifications

Socket.IO provides real-time delivery while notifications are persisted for later viewing.

Example:

New Project Assignment
You have been added to project: Website Redesign

New Task Assigned
New task assigned: Build Login API
Project: Website Redesign

Security

The backend includes:

JWT authentication

Role-based authorization

Protected project/task routes

Employee ownership checks

Helmet

Express rate limiting

Basic request sanitization

Environment-based secrets

Backend validation

API Overview

Projects

GET    /api/projects
GET    /api/projects/me
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id

Tasks

GET    /api/projects/tasks
GET    /api/projects/tasks/me
GET    /api/projects/tasks/employee/:employeeId
POST   /api/projects/tasks
PUT    /api/projects/tasks/:id
PATCH  /api/projects/tasks/:id/status
PATCH  /api/projects/tasks/:id/log-hours
DELETE /api/projects/tasks/:id

Notifications

/api/notifications/*

Additional endpoints are available for HR and the other ERP modules.

Development Commands

Frontend

cd Client
npm install
npm run dev
npm run build
npm run preview
npm run lint

Backend

cd Server
npm install
npm start

Deployment

Vercel Frontend

Recommended Vercel settings:

Root Directory: Client
Framework: Vite
Build Command: npm run build
Output Directory: dist

The repository also contains SPA rewrite configuration for React Router direct-route refreshes.

Backend

The Express backend can be deployed on Render or another Node.js hosting provider.

Production backend environment:

PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret

The deployed frontend must use the deployed backend URL for API requests.

Future Improvements

Advanced reporting and analytics

Detailed approval workflows

Audit logging

Notification preferences

Automated testing

CI/CD

More cross-module integrations

Advanced employee/project analytics

AI-powered ERP assistant

Author

Abhishek Patidar

GitHub: https://github.com/Patelabhishek01

License

This is a personal/portfolio ERP application. Add an explicit open-source license if you intend to distribute the project under specific open-source terms.
