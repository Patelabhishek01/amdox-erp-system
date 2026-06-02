require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const attendanceRoutes = require("./modules/hr/routes/attendanceRoutes");
const employeeRoutes = require("./modules/hr/routes/employeeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./modules/auth/routes/authRoutes");
const leaveRoutes = require("./modules/hr/routes/leaveRoutes");
const payrollRoutes = require("./modules/hr/routes/payrollRoutes");
const expenseRoutes = require("./modules/finance/routes/expenseRoutes");
const productRoutes = require("./modules/inventory/routes/productRoutes");
const customerRoutes = require("./modules/sales/routes/customerRoutes");
const purchaseModule = require("./modules/purchase");
const crmModule = require("./modules/crm");
const projectModule = require("./modules/project");
const helpdeskModule = require("./modules/helpdesk");
const assetModule = require("./modules/asset");
const recruitmentModule = require("./modules/recruitment");


app.use(cors());  
const connectDB = require("./config/db");

connectDB();

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", employeeRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", leaveRoutes);
app.use("/api", payrollRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vendors", purchaseModule.vendorRoutes);
app.use("/api/purchase-orders", purchaseModule.purchaseOrderRoutes);
app.use("/api/leads", crmModule.leadRoutes);
app.use("/api/projects", projectModule.projectRoutes);
app.use("/api/tickets", helpdeskModule.ticketRoutes);
app.use("/api/assets", assetModule.assetRoutes);
app.use("/api/candidates", recruitmentModule.candidateRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Amdox ERP Backend Running"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});