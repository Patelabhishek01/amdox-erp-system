const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const Setting = require("../models/Setting");

// Database Models for context-aware queries
const Employee = require("../modules/hr/models/employee");
const Leave = require("../modules/hr/models/leave");
const Product = require("../modules/inventory/models/Product");
const Ticket = require("../modules/helpdesk/models/Ticket");
const Expense = require("../modules/finance/models/expense");

// Additional Models for complete coverage
const Customer = require("../modules/sales/models/Customer");
const Candidate = require("../modules/recruitment/models/Candidate");
const Vendor = require("../modules/purchase/models/Vendors");
const PurchaseOrder = require("../modules/purchase/models/PurchaseOrder");
const Project = require("../modules/project/models/Project");
const Attendance = require("../modules/hr/models/attendance");
const Lead = require("../modules/crm/models/Lead");
const Asset = require("../modules/asset/models/Asset");

// Extract live system stats to inject as context into LLM prompts
const getSystemStatsContext = async () => {
  try {
    const employeeCount = await Employee.countDocuments();
    const lowStockCount = await Product.countDocuments({
      $expr: { $lt: ["$quantity", "$reorderLevel"] }
    });
    const pendingTicketsCount = await Ticket.countDocuments({ status: { $in: ["Open", "In Progress"] } });
    
    // Sum of expenses
    const expenses = await Expense.find();
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Active Leaves
    const activeLeaves = await Leave.find({ status: "Approved" }).populate("employee");
    const leavesList = activeLeaves.map(l => `${l.employee ? l.employee.name : "Unknown Employee"} (${l.leaveType} leave until ${l.endDate.toDateString()})`).join(", ");

    return `
SYSTEM REAL-TIME STATUS:
- Total Employees Registered: ${employeeCount}
- Products Low in Stock: ${lowStockCount}
- Pending Helpdesk Tickets: ${pendingTicketsCount}
- Total Logged Expenses: $${totalExpenses}
- Approved Employees currently on Leave: [${leavesList || "None"}]
`;
  } catch (err) {
    console.error("Error gathering system context:", err);
    return "\n(System status context currently unavailable)\n";
  }
};

// Natural Language query parser (Fallback or direct answers)
const handleLocalIntelligentQueries = async (prompt) => {
  const query = prompt.toLowerCase();
  
  if (query.includes("leave") || query.includes("employees on leave")) {
    const activeLeaves = await Leave.find({ status: "Approved" }).populate("employee");
    if (activeLeaves.length === 0) return "There are currently no employees on approved leave.";
    return `### Employees currently on approved leave:\n` + activeLeaves.map((l, idx) => {
      const empName = l.employee ? l.employee.name : "Unknown Employee";
      return `${idx + 1}. **${empName}** - ${l.leaveType} Leave (${l.startDate.toLocaleDateString()} to ${l.endDate.toLocaleDateString()}). Reason: *${l.reason}*`;
    }).join("\n");
  }

  if (query.includes("low in stock") || query.includes("low stock") || query.includes("stock")) {
    const products = await Product.find({
      $expr: { $lt: ["$quantity", "$reorderLevel"] }
    });
    if (products.length === 0) return "All products are currently well-stocked. No items are below their reorder levels.";
    return `### Low Stock Inventory Warning:\n` + products.map((p, idx) => {
      return `${idx + 1}. **${p.name}** (SKU: ${p.sku}) - Quantity: **${p.quantity}** (Reorder Threshold: ${p.reorderLevel}) - Price: $${p.price}`;
    }).join("\n");
  }

  if (query.includes("ticket") || query.includes("pending tickets") || query.includes("helpdesk")) {
    const tickets = await Ticket.find({ status: { $in: ["Open", "In Progress"] } });
    if (tickets.length === 0) return "Great news! There are no pending helpdesk tickets at the moment.";
    return `### Pending Helpdesk Tickets:\n` + tickets.map((t, idx) => {
      return `${idx + 1}. **${t.title}** - Status: \`${t.status}\` - Priority: *${t.priority}* - Assigned to: ${t.assignedTo || "Unassigned"}`;
    }).join("\n");
  }

  if (query.includes("expense") || query.includes("expense report")) {
    const expenses = await Expense.find();
    if (expenses.length === 0) return "No expense records found in the database.";
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const recent = expenses.slice(-3).reverse();
    return `### Expense Analytics Summary:\n- **Total System Expenses**: $${total}\n\n#### Recent Expenses:\n` + recent.map(e => `- **${e.title}** ($${e.amount}) on ${e.date.toLocaleDateString()} [Category: ${e.category}]`).join("\n");
  }

  if (query.includes("payroll summary")) {
    const employees = await Employee.find({ status: "Active" });
    if (employees.length === 0) return "No active employees found to compile payroll.";
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
    return `### Payroll Summary Report:\n- **Active Employees**: ${employees.length}\n- **Total Monthly Payroll Budget**: $${totalPayroll}\n- **Average Employee Salary**: $${(totalPayroll / employees.length).toFixed(2)}`;
  }

  if (query.includes("employee") || query.includes("employees") || query.includes("staff")) {
    const employees = await Employee.find();
    if (employees.length === 0) return "No employees found in the directory.";
    return `### Employee Directory (${employees.length} registered):\n` + employees.map((emp, idx) => {
      return `${idx + 1}. **${emp.name}** (ID: ${emp.employeeId}) - Dept: ${emp.department} | Role: ${emp.designation} | Status: *${emp.status}*`;
    }).join("\n");
  }

  if (query.includes("customer") || query.includes("customers") || query.includes("client")) {
    const customers = await Customer.find();
    if (customers.length === 0) return "No customers found in the database.";
    return `### Customer Registry (${customers.length} registered):\n` + customers.map((c, idx) => {
      return `${idx + 1}. **${c.name}** (${c.company || "Individual"}) - Email: ${c.email} | Phone: ${c.phone || "N/A"}`;
    }).join("\n");
  }

  if (query.includes("lead") || query.includes("leads") || query.includes("crm")) {
    const leads = await Lead.find();
    if (leads.length === 0) return "No sales leads found in the CRM.";
    return `### CRM Sales Leads:\n` + leads.map((l, idx) => {
      return `${idx + 1}. **${l.name}** (${l.company || "N/A"}) - Value: **$${l.value}** | Status: \`${l.status}\` | Contact: ${l.email}`;
    }).join("\n");
  }

  if (query.includes("project") || query.includes("projects")) {
    const projects = await Project.find();
    if (projects.length === 0) return "No projects currently found in the system.";
    return `### System Projects Progress:\n` + projects.map((p, idx) => {
      return `${idx + 1}. **${p.name}** - Status: \`${p.status}\` | Progress: **${p.progress}%** | Priority: *${p.priority}*`;
    }).join("\n");
  }

  if (query.includes("candidate") || query.includes("candidates") || query.includes("hiring")) {
    const candidates = await Candidate.find();
    if (candidates.length === 0) return "No candidates found in the recruitment pipeline.";
    return `### Recruitment Pipeline Candidates:\n` + candidates.map((c, idx) => {
      return `${idx + 1}. **${c.name}** - Role: ${c.appliedPosition} | Status: \`${c.status}\` | Rating: ${c.rating || "N/A"}/5`;
    }).join("\n");
  }

  if (query.includes("asset") || query.includes("assets")) {
    const assets = await Asset.find();
    if (assets.length === 0) return "No company assets found in the log.";
    return `### Company Asset Registry:\n` + assets.map((a, idx) => {
      return `${idx + 1}. **${a.name}** (SN: ${a.serialNumber}) - Status: \`${a.status}\` | Value: $${a.value} | Assigned to: ${a.assignedTo || "Unassigned"}`;
    }).join("\n");
  }

  if (query.includes("vendor") || query.includes("vendors")) {
    const vendors = await Vendor.find();
    if (vendors.length === 0) return "No vendors found in the procurement logs.";
    return `### Registered Procurement Vendors:\n` + vendors.map((v, idx) => {
      return `${idx + 1}. **${v.name}** (Category: ${v.category}) - Contact: ${v.contactPerson} | Email: ${v.email}`;
    }).join("\n");
  }

  if (query.includes("purchase order") || query.includes("purchase orders") || query.includes("po")) {
    const pos = await PurchaseOrder.find().populate("vendor");
    if (pos.length === 0) return "No purchase orders found.";
    return `### Purchase Orders Summary:\n` + pos.map((po, idx) => {
      const vName = po.vendor ? po.vendor.name : "Unknown Vendor";
      return `${idx + 1}. **${po.poNumber}** - Vendor: ${vName} | Amount: **$${po.totalAmount}** | Status: \`${po.status}\``;
    }).join("\n");
  }

  if (query.includes("attendance") || query.includes("check in")) {
    const attendances = await Attendance.find().populate("employee");
    if (attendances.length === 0) return "No attendance records log found for today.";
    return `### Employee Attendance Logs:\n` + attendances.map((att, idx) => {
      const empName = att.employee ? att.employee.name : "Unknown Employee";
      return `${idx + 1}. **${empName}** - Status: \`${att.status}\` | Check In: ${att.checkIn || "-"} | Check Out: ${att.checkOut || "-"}`;
    }).join("\n");
  }

  if (query.includes("architecture") || query.includes("tech stack") || query.includes("design") || query.includes("frameworks")) {
    return `### 🏗️ Amdox ERP Suite Architecture & Tech Stack
This project is built using a clean, enterprise-grade **modular MERN Stack** matching the SOLID and DRY design principles.

#### 💻 Frontend Tech Stack:
- **React.js & Vite**: Fast development server and builds.
- **Vite Router**: Robust client-side routing.
- **Recharts**: Enterprise-ready data visualization charts.
- **Framer Motion**: Smooth, premium transitions and micro-animations.

#### ⚙️ Backend Tech Stack:
- **Node.js & Express.js**: Asynchronous event-driven server runtime.
- **MongoDB & Mongoose**: Flexible, high-performance document store.
- **Socket.IO**: Real-time communication for instant push notifications.
- **Security Middlewares**: Helmet, Express Rate Limit, bcrypt password hashing.

#### 📁 Clean Folder Structure:
- **Modular Design**: Modules are fully independent, containing their own routes, controllers, and models (e.g. \`auth\`, \`hr\`, \`finance\`, \`inventory\`, \`sales\`, \`purchase\`, \`crm\`, \`project\`, \`helpdesk\`, \`asset\`, \`recruitment\`).
- **Layers**: Controller ➔ Service ➔ Repository ➔ Mongoose Models.`;
  }

  if (query.includes("module") || query.includes("features") || query.includes("capabilities")) {
    return `### 💼 Amdox ERP Enterprise Modules Overview
Amdox ERP includes 11 key enterprise modules, fully decoupled and independent:

1. **Authentication & User Management**: Handles role-based access control (RBAC), database sessions, and temporary login flows. Public signup is disabled; only Admins can create accounts.
2. **Human Resources (HR)**: Attendance check-in/out, leave approvals, payroll salary configurations, performance appraisals, appraisals, training and exit management.
3. **Finance & Accounting**: Expense logs, budget constraints, invoices, vendor payments, GST calculations, P&L sheets.
4. **Inventory Management**: Product catalogs, SKU/barcode tracking, warehouse location layouts, low stock alerts, stock transfers.
5. **Customer Relationship Management (CRM)**: Leads generation, opportunity pipelines, meetings schedule, sales prediction, customer register.
6. **Project Management**: Project milestones, Gantt charts, Kanban boards, Scrum sprint structures, employee timesheet tracking.
7. **Helpdesk & Ticketing**: Support tickets queue, priorities, SLA timers, internal notes, comment threads, attachments.
8. **Asset Management**: Serial key allocations, value deprecations, assignment logs.
9. **Recruitment Management**: Hiring pipeline, candidates tracking, offer letters.`;
  }

  if (query.includes("security") || query.includes("lockout") || query.includes("password policy") || query.includes("auth rules")) {
    return `### 🔒 Amdox ERP Security Policies & Hardening
The application enforces enterprise-grade security protocols to protect sensitive corporate assets:

- **Brute Force Lockout**: Accounts are automatically locked for 15 minutes after 5 consecutive incorrect login attempts.
- **Force Password Reset**: Admin-created users are issued a random temporary password and forced to choose a new secure password on their first login.
- **Password History**: Users cannot reuse any of their last 3 passwords when resetting their credentials.
- **Two-Factor Authentication (2FA)**: Speakeasy-powered TOTP (Google Authenticator) can be activated in User Settings.
- **Session Revocation**: Real-time device tracking lists all active tokens, allowing users to revoke sessions or logout of all devices globally.
- **Security Middlewares**: Proactively protects against CSRF/XSS, rates limit requests (1000 requests / 15 mins), sanitizes incoming parameters from MongoDB operators injection, and serves uploads safely.`;
  }

  return null;
};

// Route: AI Chat Completion
router.post("/ai/chat", authMiddleware, async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // 1. Check if the prompt matches a local database search pattern
    const localResult = await handleLocalIntelligentQueries(prompt);
    if (localResult) {
      return res.status(200).json({ response: localResult });
    }

    // 2. Fetch System settings for LLM configurations
    let config = await Setting.findOne();
    if (!config) {
      config = new Setting();
      await config.save();
    }

    const provider = config.llmProvider || "mock";
    const apiKey = config.llmApiKey;

    // Retrieve live context to inject in the prompt
    const systemContext = await getSystemStatsContext();

    const projectContext = `
AMDOX ERP ENTERPRISE BLUEPRINT & TECH STACK:
- Tech Stack: MongoDB, Express, React, Node.js (MERN), Socket.IO, Recharts, Framer Motion.
- Core Architecture: Decentralized modular layout with isolated module directories (e.g., auth, hr, finance, inventory, sales, purchase, crm, project, helpdesk, asset, recruitment).
- Reusable UI Components: DataTable, PageHeader, RecordTimeline, SkeletonLoader, StatusBadge, RecordComments, RecordAttachments.
- Hardened Security: Lockout after 5 unsuccessful logins (15 mins), forced password updates on temporary Admin-created credentials, recent password history check (last 3 passwords).
- Socket.IO Rooms: Rooms organized by User ID, Department Room (e.g., HR, Sales, CRM), or Role for targeting instant notifications.
- AI Assistant: Offers Voice Input/Output Speech-To-Text and Text-To-Speech translation, local file parser, and live context queries.
`;

    if (provider === "openai" && apiKey) {
      try {
        const systemPrompt = `You are the Amdox ERP Intelligent Assistant. Help users automate tasks, summarize system records, write emails, and generate insights. Answer questions format-rich in Markdown.
        
${projectContext}

Here is the active real-time data context of the ERP:
${systemContext}`;

        const messages = [
          { role: "system", content: systemPrompt },
          ...(history || []).map(h => ({ role: h.role, content: h.content })),
          { role: "user", content: prompt }
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7
          })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
          return res.status(200).json({ response: data.choices[0].message.content });
        } else {
          console.error("OpenAI Error Details:", data);
          throw new Error(data.error?.message || "Invalid response from OpenAI API");
        }
      } catch (err) {
        console.error("OpenAI Connection Failed, falling back to mock response.", err);
      }
    }

    if (provider === "gemini" && apiKey) {
      try {
        const contents = [
          { role: "user", parts: [{ text: `System Description: You are the Amdox ERP Intelligent Assistant. Help users automate tasks, summarize records, write emails, and generate insights.
          
${projectContext}

Real-Time ERP Data Context:
${systemContext}

User Question: ${prompt}` }] }
        ];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]) {
          return res.status(200).json({ response: data.candidates[0].content.parts[0].text });
        } else {
          console.error("Gemini Error Details:", data);
          throw new Error("Invalid response from Gemini API");
        }
      } catch (err) {
        console.error("Gemini Connection Failed, falling back to mock response.", err);
      }
    }

    // Default Mock AI response using live system context
    const mockResponses = [
      `### Amdox ERP Intelligent Assistant Insights
I parsed your request using our local ERP analytics parser.
Here is the active system snapshot context:
${systemContext}

You can ask me questions like:
- "Show employees on leave"
- "Show pending tickets"
- "Which products are low in stock?"
- "Generate payroll summary"
- "Generate monthly expense report"

*(To activate full language processing, please enter a valid OpenAI or Gemini API Key in the Settings page).*`,
    ];

    res.status(200).json({ response: mockResponses[0] });

  } catch (error) {
    console.error("AI Assistant Route error:", error);
    res.status(500).json({ message: "Server error processing AI request" });
  }
});

module.exports = router;
