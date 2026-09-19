// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import { RegistrationFormReact } from "./modules/auth/Registration";
// // import { LoginForm } from "./modules/auth/Login";
// // import Dashboard from "./modules/dashboard/Dashboard";
// // import Profile from "./modules/profile/Profile";
// // import Settings from "./modules/setting/Setting";
// // import AdminPanel from "./modules/admin/AdminPanel";
// // import Reports from "./modules/reports/Reports";
// // import Users from "./modules/admin/Users";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import Employees from "./modules/hr/Employees";
// // import Attendance from "./modules/hr/Attendance";
// // import LeaveManagement from "./modules/hr/LeaveManagement";
// // import Payroll from "./modules/hr/Payroll";
// // import HRDashboard from "./modules/dashboard/HRDashboard";
// // import AddExpense from "./modules/finance/pages/AddExpense";
// // import EditExpense from "./modules/finance/pages/EditExpense";
// // import Expense from "./modules/finance/pages/Expenses";
// // import Product from "./modules/inventory/Product";
// // import AddProduct from "./modules/inventory/pages/AddProduct";
// // import EditProduct from "./modules/inventory/pages/EditProduct";
// // import InventoryDashboard from "./modules/dashboard/InventoryDashboard";
// // import Customer from "./modules/sales/Customer";
// // import AddCustomer from "./modules/sales/pages/AddCustomer";
// // import EditCustomer from "./modules/sales/pages/EditCustomer";
// // import SalesDashboard from "./modules/dashboard/SalesDashboard";
// // import Purchase from "./modules/purchase/pages/Purchase";
// // import PurchaseDashboard from "./modules/dashboard/PurchaseDashboard";
// // import CRM from "./modules/crm/pages/CRM";
// // import CRMDashboard from "./modules/dashboard/CRMDashboard";
// // import Project from "./modules/project/pages/Project";
// // import ProjectDashboard from "./modules/dashboard/ProjectDashboard";
// // import HelpDesk from "./modules/helpdesk/pages/HelpDesk";
// // import HelpDeskDashboard from "./modules/dashboard/HelpDeskDashboard";
// // import Asset from "./modules/asset/pages/Asset";
// // import AssetDashboard from "./modules/dashboard/AssetDashboard";
// // import Recruitment from "./modules/recruitment/pages/Recruitment";
// // import RecruitmentDashboard from "./modules/dashboard/RecruitmentDashboard";

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/" element={<LoginForm />} />
// //         <Route path="/register" element={<RegistrationFormReact />} />
// //         <Route path="/dashboard" element={<Dashboard />} />
// //         <Route path="/profile" element={<Profile />} />
// //         <Route path="/settings" element={<Settings />} />
// //         <Route path="/admin" element={<AdminPanel />} />
// //         <Route path="/reports" element={<Reports />} />
// //         <Route path="/users" element={<Users />} />
// //         <Route path="/employees" element={<Employees />} />
// //         <Route path="/attendance" element={<Attendance />}/>
// //         <Route path="/leaves" element={<LeaveManagement />} />
// //         <Route path="/payroll" element={<Payroll />} />
// //         <Route path="/hr-dashboard" element={<HRDashboard />} />
// //         {/* <Route path="/expenses" element={<Expenses />} /> */}
// //         <Route path="/finance/expenses" element={<Expense />} />
// //         <Route path="/finance/expenses/add" element={<AddExpense />} />
// //         <Route path="/finance/expenses/edit/:id" element={<EditExpense />}/>
// //         <Route path="/inventory/products" element={<Product />}/>
// //         <Route path="/inventory/products/add" element={<AddProduct />}/>
// //         <Route path="/inventory/products/edit/:id" element={<EditProduct />}/>
// //         <Route path="/inventory-dashboard" element={<InventoryDashboard />}/>
// //         <Route path="/sales/customers" element={<Customer />}/>
// //         <Route path="/sales/customers/add" element={<AddCustomer />}/>
// //         <Route path="/sales/customers/edit/:id" element={<EditCustomer />}/>
// //         <Route path="/sales-dashboard" element={<SalesDashboard />}/>
// //         <Route path="/purchase" element={<Purchase />} />
// //         <Route path="/purchase-dashboard" element={<PurchaseDashboard />} />
// //         <Route path="/crm" element={<CRM />} />
// //         <Route path="/crm-dashboard" element={<CRMDashboard />} />
// //         <Route path="/project" element={<Project />} />
// //         <Route path="/project-dashboard" element={<ProjectDashboard />} />
// //         <Route path="/helpdesk" element={<HelpDesk />} />
// //         <Route path="/helpdesk-dashboard" element={<HelpDeskDashboard />}/>
// //         <Route path="/asset" element={<Asset />} />
// //         <Route path="/asset-dashboard" element={<AssetDashboard />} />
// //         <Route path="/recruitment" element={<Recruitment />} />
// //         <Route path="/recruitment-dashboard" element={<RecruitmentDashboard />}/>
// //       </Routes>
// //       <ToastContainer />
// //     </BrowserRouter>
// //   );
// // }

// // export default App;












// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /* =========================
//    Authentication
// ========================= */
// import { RegistrationFormReact } from "./modules/auth/Registration";
// import { LoginForm } from "./modules/auth/Login";

// /* =========================
//    Core Pages
// ========================= */
// import Dashboard from "./modules/dashboard/Dashboard";
// import Profile from "./modules/profile/Profile";
// // import Settings from "./modules/setting/Setting";
// import AdminPanel from "./modules/admin/AdminPanel";
// import Reports from "./modules/reports/Reports";
// import Users from "./modules/admin/Users";

// /* =========================
//    HR Module
// ========================= */
// import Employees from "./modules/hr/Employees";
// import Attendance from "./modules/hr/Attendance";
// import LeaveManagement from "./modules/hr/LeaveManagement";
// import Payroll from "./modules/hr/Payroll";
// import HRDashboard from "./modules/dashboard/HRDashboard";

// /* =========================
//    Finance Module
// ========================= */
// import Expense from "./modules/finance/pages/Expenses";
// import AddExpense from "./modules/finance/pages/AddExpense";
// import EditExpense from "./modules/finance/pages/EditExpense";

// /* =========================
//    Inventory Module
// ========================= */
// import Product from "./modules/inventory/Product";
// import AddProduct from "./modules/inventory/pages/AddProduct";
// import EditProduct from "./modules/inventory/pages/EditProduct";
// import InventoryDashboard from "./modules/dashboard/InventoryDashboard";

// /* =========================
//    Sales Module
// ========================= */
// import Customer from "./modules/sales/Customer";
// import AddCustomer from "./modules/sales/pages/AddCustomer";
// import EditCustomer from "./modules/sales/pages/EditCustomer";
// import SalesDashboard from "./modules/dashboard/SalesDashboard";

// /* =========================
//    Purchase Module
// ========================= */
// import Purchase from "./modules/purchase/pages/Purchase";
// import PurchaseDashboard from "./modules/dashboard/PurchaseDashboard";

// /* =========================
//    CRM Module
// ========================= */
// import CRM from "./modules/crm/pages/CRM";
// import CRMDashboard from "./modules/dashboard/CRMDashboard";

// /* =========================
//    Project Management Module
// ========================= */
// import Project from "./modules/project/pages/Project";
// import ProjectDashboard from "./modules/dashboard/ProjectDashboard";

// /* =========================
//    Help Desk Module
// ========================= */
// import HelpDesk from "./modules/helpdesk/pages/HelpDesk";
// import HelpDeskDashboard from "./modules/dashboard/HelpDeskDashboard";

// /* =========================
//    Asset Management Module
// ========================= */
// import Asset from "./modules/asset/pages/Asset";
// import AssetDashboard from "./modules/dashboard/AssetDashboard";

// /* =========================
//    Recruitment Module
// ========================= */
// import Recruitment from "./modules/recruitment/pages/Recruitment";
// import RecruitmentDashboard from "./modules/dashboard/RecruitmentDashboard";
// import AIAssistant from "./pages/AIAssistant";
// import Settings from "./pages/Settings";

// /* =========================
//    Training Module
//    (Create this component later)
// ========================= */
// // import Training from "./modules/training/pages/Training";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ======================================
//             Authentication Routes
//         ====================================== */}
//         <Route path="/" element={<LoginForm />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route
//           path="/register"
//           element={<RegistrationFormReact />}
//         />

//         {/* ======================================
//             Main Dashboard
//         ====================================== */}
//         <Route path="/dashboard" element={<Dashboard />} />

//         {/* ======================================
//             User Management
//         ====================================== */}
//         <Route path="/profile" element={<Profile />} />
//         {/* <Route path="/settings" element={<Settings />} /> */}
//         <Route path="/admin" element={<AdminPanel />} />
//         <Route path="/reports" element={<Reports />} />
//         <Route path="/users" element={<Users />} />

//         {/* ======================================
//             HR Module
//         ====================================== */}
//         <Route path="/employees" element={<Employees />} />
//         <Route path="/attendance" element={<Attendance />} />
//         <Route path="/leaves" element={<LeaveManagement />} />
//         <Route path="/payroll" element={<Payroll />} />
//         <Route
//           path="/hr-dashboard"
//           element={<HRDashboard />}
//         />

//         {/* ======================================
//             Finance Module
//         ====================================== */}
//         <Route
//           path="/finance/expenses"
//           element={<Expense />}
//         />
//         <Route
//           path="/finance/expenses/add"
//           element={<AddExpense />}
//         />
//         <Route
//           path="/finance/expenses/edit/:id"
//           element={<EditExpense />}
//         />

//         {/* ======================================
//             Inventory Module
//         ====================================== */}
//         <Route
//           path="/inventory/products"
//           element={<Product />}
//         />
//         <Route
//           path="/inventory/products/add"
//           element={<AddProduct />}
//         />
//         <Route
//           path="/inventory/products/edit/:id"
//           element={<EditProduct />}
//         />
//         <Route
//           path="/inventory-dashboard"
//           element={<InventoryDashboard />}
//         />

//         {/* ======================================
//             Sales Module
//         ====================================== */}
//         <Route
//           path="/sales/customers"
//           element={<Customer />}
//         />
//         <Route
//           path="/sales/customers/add"
//           element={<AddCustomer />}
//         />
//         <Route
//           path="/sales/customers/edit/:id"
//           element={<EditCustomer />}
//         />
//         <Route
//           path="/sales-dashboard"
//           element={<SalesDashboard />}
//         />

//         {/* ======================================
//             Purchase Module
//         ====================================== */}
//         <Route path="/purchase" element={<Purchase />} />
//         <Route
//           path="/purchase-dashboard"
//           element={<PurchaseDashboard />}
//         />

//         {/* ======================================
//             CRM Module
//         ====================================== */}
//         <Route path="/crm" element={<CRM />} />
//         <Route
//           path="/crm-dashboard"
//           element={<CRMDashboard />}
//         />

//         {/* ======================================
//             Project Management Module
//         ====================================== */}
//         <Route path="/project" element={<Project />} />
//         <Route
//           path="/project-dashboard"
//           element={<ProjectDashboard />}
//         />

//         {/* ======================================
//             Help Desk Module
//         ====================================== */}
//         <Route path="/helpdesk" element={<HelpDesk />} />
//         <Route
//           path="/helpdesk-dashboard"
//           element={<HelpDeskDashboard />}
//         />

//         {/* ======================================
//             Asset Management Module
//         ====================================== */}
//         <Route path="/asset" element={<Asset />} />
//         <Route
//           path="/asset-dashboard"
//           element={<AssetDashboard />}
//         />

//         {/* ======================================
//             Recruitment Module
//         ====================================== */}
//         <Route
//           path="/recruitment"
//           element={<Recruitment />}
//         />
//         <Route
//           path="/recruitment-dashboard"
//           element={<RecruitmentDashboard />}
//         />

//         {/* ======================================
//             Training Module (Future)
//         ====================================== */}
//         {/* <Route path="/training" element={<Training />} /> */}

//         {/* ======================================
//             Fallback Route
//         ====================================== */}
//         <Route
//           path="*"
//           element={<Navigate to="/dashboard" replace />}
//         />
//         <Route path="/settings" element={<Settings />} />
//         <Route path="/ai-assistant" element={<AIAssistant />} />
//       </Routes>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="light"
//       />
//     </BrowserRouter>
//   );
// }

// export default App;







import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./component/PrivateRoutes";

// Auth
import { LoginForm }           from "./modules/auth/Login";
import { RegistrationFormReact } from "./modules/auth/Registration";

// Core
import Dashboard   from "./modules/dashboard/Dashboard";
import Profile     from "./modules/profile/Profile";
import AdminPanel  from "./modules/admin/AdminPanel";
import Reports     from "./modules/reports/Reports";
import Users       from "./modules/admin/Users";
import Settings    from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import AuditLogs   from "./pages/AuditLogs";

// HR
import Employees       from "./modules/hr/Employees";
import Attendance      from "./modules/hr/Attendance";
import LeaveManagement from "./modules/hr/LeaveManagement";
import Payroll         from "./modules/hr/Payroll";
import HRDashboard     from "./modules/dashboard/HRDashboard";

// Finance
import Expense     from "./modules/finance/pages/Expenses";
import AddExpense  from "./modules/finance/pages/AddExpense";
import EditExpense from "./modules/finance/pages/EditExpense";

// Inventory
import Product            from "./modules/inventory/Product";
import AddProduct         from "./modules/inventory/pages/AddProduct";
import EditProduct        from "./modules/inventory/pages/EditProduct";
import InventoryDashboard from "./modules/dashboard/InventoryDashboard";

// Sales
import Customer        from "./modules/sales/Customer";
import AddCustomer     from "./modules/sales/pages/AddCustomer";
import EditCustomer    from "./modules/sales/pages/EditCustomer";
import SalesOrders     from "./modules/sales/pages/SalesOrders";
import SalesDashboard  from "./modules/dashboard/SalesDashboard";

// Purchase
import Purchase          from "./modules/purchase/pages/Purchase";
import PurchaseDashboard from "./modules/dashboard/PurchaseDashboard";

// CRM
import CRM          from "./modules/crm/pages/CRM";
import CRMDashboard from "./modules/dashboard/CRMDashboard";

// Project
import Project          from "./modules/project/pages/Project";
import ProjectDashboard from "./modules/dashboard/ProjectDashboard";

// HelpDesk
import HelpDesk          from "./modules/helpdesk/pages/HelpDesk";
import HelpDeskDashboard from "./modules/dashboard/HelpDeskDashboard";

// Asset
import Asset          from "./modules/asset/pages/Asset";
import AssetDashboard from "./modules/dashboard/AssetDashboard";

// Recruitment
import Recruitment           from "./modules/recruitment/pages/Recruitment";
import RecruitmentDashboard  from "./modules/dashboard/RecruitmentDashboard";

// ESS
import ESSDashboard from "./modules/ess/EmployeeDashboard";

// ─── Role definitions ──────────────────────────────────────────────────────────
const ROLES = {
  SUPER_ADMIN:       "super admin",
  ADMIN:             "admin",
  HR_MANAGER:        "hr manager",
  HR_EXECUTIVE:      "hr executive",
  FINANCE_MANAGER:   "finance manager",
  ACCOUNTANT:        "accountant",
  CRM_MANAGER:       "crm manager",
  SALES_MANAGER:     "sales manager",
  SALES_EXECUTIVE:   "sales executive",
  INVENTORY_MANAGER: "inventory manager",
  STORE_KEEPER:      "store keeper",
  PURCHASE_MANAGER:  "purchase manager",
  PROJECT_MANAGER:   "project manager",
  HELP_DESK_AGENT:   "help desk agent",
  ASSET_MANAGER:     "asset manager",
  RECRUITER:         "recruiter",
  EMPLOYEE:          "employee",
};

// Grouped Roles for easier routing
const ADMIN_GROUP     = [ROLES.SUPER_ADMIN, ROLES.ADMIN];
const HR_GROUP        = [...ADMIN_GROUP, ROLES.HR_MANAGER, ROLES.HR_EXECUTIVE];
const FINANCE_GROUP   = [...ADMIN_GROUP, ROLES.FINANCE_MANAGER, ROLES.ACCOUNTANT];
const INVENTORY_GROUP = [...ADMIN_GROUP, ROLES.INVENTORY_MANAGER, ROLES.STORE_KEEPER];
const SALES_GROUP     = [...ADMIN_GROUP, ROLES.SALES_MANAGER, ROLES.SALES_EXECUTIVE];
const PURCHASE_GROUP  = [...ADMIN_GROUP, ROLES.PURCHASE_MANAGER];
const CRM_GROUP       = [...ADMIN_GROUP, ROLES.CRM_MANAGER, ...SALES_GROUP];
const PROJECT_GROUP   = [...ADMIN_GROUP, ROLES.PROJECT_MANAGER];
const HELPDESK_GROUP  = [...ADMIN_GROUP, ROLES.HELP_DESK_AGENT];
const ASSET_GROUP     = [...ADMIN_GROUP, ROLES.ASSET_MANAGER];
const RECRUIT_GROUP   = [...ADMIN_GROUP, ROLES.RECRUITER, ROLES.HR_MANAGER];
const ESS_GROUP       = [...ADMIN_GROUP, ROLES.EMPLOYEE];
const ALL             = Object.values(ROLES);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/"         element={<LoginForm />} />
        <Route path="/login"    element={<LoginForm />} />
        <Route path="/register" element={<RegistrationFormReact />} />

        {/* ── Shared by all roles ── */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={ALL}>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute allowedRoles={ALL}>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute allowedRoles={ALL}>
            <Settings />
          </PrivateRoute>
        } />
        <Route path="/ai-assistant" element={
          <PrivateRoute allowedRoles={ALL}>
            <AIAssistant />
          </PrivateRoute>
        } />

        {/* ── Admin only ── */}
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={ADMIN_GROUP}>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute allowedRoles={ADMIN_GROUP}>
            <Users />
          </PrivateRoute>
        } />
        <Route path="/audit-logs" element={
          <PrivateRoute allowedRoles={ADMIN_GROUP}>
            <AuditLogs />
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute allowedRoles={FINANCE_GROUP}>
            <Reports />
          </PrivateRoute>
        } />

        {/* ── HR Module ── */}
        <Route path="/hr-dashboard" element={
          <PrivateRoute allowedRoles={HR_GROUP}>
            <HRDashboard />
          </PrivateRoute>
        } />
        <Route path="/employees" element={
          <PrivateRoute allowedRoles={HR_GROUP}>
            <Employees />
          </PrivateRoute>
        } />
        <Route path="/attendance" element={
          <PrivateRoute allowedRoles={[...HR_GROUP, ROLES.EMPLOYEE]}>
            <Attendance />
          </PrivateRoute>
        } />
        <Route path="/leaves" element={
          <PrivateRoute allowedRoles={[...HR_GROUP, ROLES.EMPLOYEE]}>
            <LeaveManagement />
          </PrivateRoute>
        } />
        <Route path="/payroll" element={
          <PrivateRoute allowedRoles={HR_GROUP}>
            <Payroll />
          </PrivateRoute>
        } />

        {/* ── Finance Module ── */}
        <Route path="/finance/expenses" element={
          <PrivateRoute allowedRoles={FINANCE_GROUP}>
            <Expense />
          </PrivateRoute>
        } />
        <Route path="/finance/expenses/add" element={
          <PrivateRoute allowedRoles={FINANCE_GROUP}>
            <AddExpense />
          </PrivateRoute>
        } />
        <Route path="/finance/expenses/edit/:id" element={
          <PrivateRoute allowedRoles={FINANCE_GROUP}>
            <EditExpense />
          </PrivateRoute>
        } />

        {/* ── Inventory Module ── */}
        <Route path="/inventory-dashboard" element={
          <PrivateRoute allowedRoles={INVENTORY_GROUP}>
            <InventoryDashboard />
          </PrivateRoute>
        } />
        <Route path="/inventory/products" element={
          <PrivateRoute allowedRoles={INVENTORY_GROUP}>
            <Product />
          </PrivateRoute>
        } />
        <Route path="/inventory/products/add" element={
          <PrivateRoute allowedRoles={INVENTORY_GROUP}>
            <AddProduct />
          </PrivateRoute>
        } />
        <Route path="/inventory/products/edit/:id" element={
          <PrivateRoute allowedRoles={INVENTORY_GROUP}>
            <EditProduct />
          </PrivateRoute>
        } />

        {/* ── Sales Module ── */}
        <Route path="/sales-dashboard" element={
          <PrivateRoute allowedRoles={SALES_GROUP}>
            <SalesDashboard />
          </PrivateRoute>
        } />
        <Route path="/sales/customers" element={
          <PrivateRoute allowedRoles={CRM_GROUP}>
            <Customer />
          </PrivateRoute>
        } />
        <Route path="/sales/customers/add" element={
          <PrivateRoute allowedRoles={SALES_GROUP}>
            <AddCustomer />
          </PrivateRoute>
        } />
        <Route path="/sales/customers/edit/:id" element={
          <PrivateRoute allowedRoles={SALES_GROUP}>
            <EditCustomer />
          </PrivateRoute>
        } />
        <Route path="/sales/orders" element={
          <PrivateRoute allowedRoles={SALES_GROUP}>
            <SalesOrders />
          </PrivateRoute>
        } />

        {/* ── Purchase Module ── */}
        <Route path="/purchase-dashboard" element={
          <PrivateRoute allowedRoles={PURCHASE_GROUP}>
            <PurchaseDashboard />
          </PrivateRoute>
        } />
        <Route path="/purchase" element={
          <PrivateRoute allowedRoles={PURCHASE_GROUP}>
            <Purchase />
          </PrivateRoute>
        } />

        {/* ── CRM Module ── */}
        <Route path="/crm-dashboard" element={
          <PrivateRoute allowedRoles={CRM_GROUP}>
            <CRMDashboard />
          </PrivateRoute>
        } />
        <Route path="/crm" element={
          <PrivateRoute allowedRoles={CRM_GROUP}>
            <CRM />
          </PrivateRoute>
        } />

        {/* ── Project Module ── */}
        <Route path="/project-dashboard" element={
          <PrivateRoute allowedRoles={PROJECT_GROUP}>
            <ProjectDashboard />
          </PrivateRoute>
        } />
        <Route path="/project" element={
          <PrivateRoute allowedRoles={PROJECT_GROUP}>
            <Project />
          </PrivateRoute>
        } />

        {/* ── HelpDesk Module ── */}
        <Route path="/helpdesk-dashboard" element={
          <PrivateRoute allowedRoles={HELPDESK_GROUP}>
            <HelpDeskDashboard />
          </PrivateRoute>
        } />
        <Route path="/helpdesk" element={
          <PrivateRoute allowedRoles={HELPDESK_GROUP}>
            <HelpDesk />
          </PrivateRoute>
        } />

        {/* ── Asset Module ── */}
        <Route path="/asset-dashboard" element={
          <PrivateRoute allowedRoles={ASSET_GROUP}>
            <AssetDashboard />
          </PrivateRoute>
        } />
        <Route path="/asset" element={
          <PrivateRoute allowedRoles={ASSET_GROUP}>
            <Asset />
          </PrivateRoute>
        } />

        {/* ── Recruitment Module ── */}
        <Route path="/recruitment-dashboard" element={
          <PrivateRoute allowedRoles={RECRUIT_GROUP}>
            <RecruitmentDashboard />
          </PrivateRoute>
        } />
        <Route path="/recruitment" element={
          <PrivateRoute allowedRoles={RECRUIT_GROUP}>
            <Recruitment />
          </PrivateRoute>
        } />

        {/* ── ESS Module ── */}
        <Route path="/ess-dashboard" element={
          <PrivateRoute allowedRoles={ESS_GROUP}>
            <ESSDashboard />
          </PrivateRoute>
        } />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;