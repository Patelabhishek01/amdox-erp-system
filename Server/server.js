require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);

// ─── Socket.IO Setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("Real-time Socket connected:", socket.id);
  
  socket.on("register", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`User socket registered for user ID: ${userId}`);
    }
  });

  socket.on("joinDepartment", (department) => {
    if (department) {
      socket.join(department);
      console.log(`User socket joined department room: ${department}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Expose Socket.IO globally for controllers
app.set("io", io);

// ─── Security Middlewares ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading static upload files on client
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000, // Limit each IP to 1000 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use(globalLimiter);

// Prevent Parameter Pollution & Basic XSS Protection
app.use((req, res, next) => {
  // Simple check to sanitize query/body against MongoDB operators
  if (req.body) {
    for (let key in req.body) {
      if (key.startsWith("$")) {
        delete req.body[key];
      }
    }
  }
  next();
});

app.use(cors());  
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Route Imports ─────────────────────────────────────────────────────────────
const attendanceRoutes = require("./modules/hr/routes/attendanceRoutes");
const employeeRoutes = require("./modules/hr/routes/employeeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./modules/auth/routes/authRoutes");
const leaveRoutes = require("./modules/hr/routes/leaveRoutes");
const payrollRoutes = require("./modules/hr/routes/payrollRoutes");
const expenseRoutes = require("./modules/finance/routes/expenseRoutes");
const transactionRoutes = require("./modules/finance/routes/transactionRoutes");
const productRoutes = require("./modules/inventory/routes/productRoutes");
const customerRoutes = require("./modules/sales/routes/customerRoutes");
const salesOrderRoutes = require("./modules/sales/routes/salesOrderRoutes");
const purchaseModule = require("./modules/purchase");
const crmModule = require("./modules/crm");
const projectModule = require("./modules/project");
const helpdeskModule = require("./modules/helpdesk");
const assetModule = require("./modules/asset");
const recruitmentModule = require("./modules/recruitment");

// Core Upgraded Routes
const notificationRoutes = require("./routes/notificationRoutes");
const settingRoutes = require("./routes/settingRoutes");
const aiRoutes = require("./routes/aiRoutes");
const recordRoutes = require("./routes/recordRoutes");

// ─── Route Registrations ───────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", employeeRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", leaveRoutes);
app.use(["/api/hr", "/api"], payrollRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/finance", transactionRoutes);
app.use(["/api/inventory", "/api/products"], productRoutes);
app.use("/api/customers", customerRoutes);
app.use(["/api/sales/orders", "/api/orders"], salesOrderRoutes);
app.use("/api/vendors", purchaseModule.vendorRoutes);
app.use(["/api/purchase/orders", "/api/purchase-orders"], purchaseModule.purchaseOrderRoutes);
app.use(["/api/crm/leads", "/api/leads"], crmModule.leadRoutes);
app.use("/api/projects", projectModule.projectRoutes);
app.use(["/api/helpdesk/tickets", "/api/tickets"], helpdeskModule.ticketRoutes);
app.use("/api/assets", assetModule.assetRoutes);
app.use("/api/candidates", recruitmentModule.candidateRoutes);

// Core Additions
app.use("/api", notificationRoutes);
app.use("/api", settingRoutes);
app.use("/api", aiRoutes);
app.use("/api", recordRoutes);

const connectDB = require("./config/db");
connectDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Amdox ERP Enterprise Backend Running"
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});