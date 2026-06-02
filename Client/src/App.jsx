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

// ─── Role definitions ──────────────────────────────────────────────────────────
const ROLES = {
  ADMIN:     "admin",
  HR:        "hr",
  FINANCE:   "finance",
  INVENTORY: "inventory",
  SALES:     "sales",
  PURCHASE:  "purchase",
  CRM:       "crm",
  PROJECT:   "project",
  HELPDESK:  "helpdesk",
  ASSET:     "asset",
  EMPLOYEE:  "employee",
};

// Shorthand: who can see everything
const ALL = Object.values(ROLES);
const ADMIN_ONLY = [ROLES.ADMIN];

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
          <PrivateRoute allowedRoles={ADMIN_ONLY}>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute allowedRoles={ADMIN_ONLY}>
            <Users />
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <Reports />
          </PrivateRoute>
        } />

        {/* ── HR Module ── */}
        <Route path="/hr-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <HRDashboard />
          </PrivateRoute>
        } />
        <Route path="/employees" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <Employees />
          </PrivateRoute>
        } />
        <Route path="/attendance" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE]}>
            <Attendance />
          </PrivateRoute>
        } />
        <Route path="/leaves" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE]}>
            <LeaveManagement />
          </PrivateRoute>
        } />
        <Route path="/payroll" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <Payroll />
          </PrivateRoute>
        } />

        {/* ── Finance Module ── */}
        <Route path="/finance/expenses" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <Expense />
          </PrivateRoute>
        } />
        <Route path="/finance/expenses/add" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <AddExpense />
          </PrivateRoute>
        } />
        <Route path="/finance/expenses/edit/:id" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <EditExpense />
          </PrivateRoute>
        } />

        {/* ── Inventory Module ── */}
        <Route path="/inventory-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}>
            <InventoryDashboard />
          </PrivateRoute>
        } />
        <Route path="/inventory/products" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}>
            <Product />
          </PrivateRoute>
        } />
        <Route path="/inventory/products/add" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}>
            <AddProduct />
          </PrivateRoute>
        } />
        <Route path="/inventory/products/edit/:id" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}>
            <EditProduct />
          </PrivateRoute>
        } />

        {/* ── Sales Module ── */}
        <Route path="/sales-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.SALES]}>
            <SalesDashboard />
          </PrivateRoute>
        } />
        <Route path="/sales/customers" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.SALES, ROLES.CRM]}>
            <Customer />
          </PrivateRoute>
        } />
        <Route path="/sales/customers/add" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.SALES]}>
            <AddCustomer />
          </PrivateRoute>
        } />
        <Route path="/sales/customers/edit/:id" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.SALES]}>
            <EditCustomer />
          </PrivateRoute>
        } />

        {/* ── Purchase Module ── */}
        <Route path="/purchase-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE]}>
            <PurchaseDashboard />
          </PrivateRoute>
        } />
        <Route path="/purchase" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE]}>
            <Purchase />
          </PrivateRoute>
        } />

        {/* ── CRM Module ── */}
        <Route path="/crm-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.CRM]}>
            <CRMDashboard />
          </PrivateRoute>
        } />
        <Route path="/crm" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.CRM, ROLES.SALES]}>
            <CRM />
          </PrivateRoute>
        } />

        {/* ── Project Module ── */}
        <Route path="/project-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.PROJECT]}>
            <ProjectDashboard />
          </PrivateRoute>
        } />
        <Route path="/project" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.PROJECT]}>
            <Project />
          </PrivateRoute>
        } />

        {/* ── HelpDesk Module ── */}
        <Route path="/helpdesk-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HELPDESK]}>
            <HelpDeskDashboard />
          </PrivateRoute>
        } />
        <Route path="/helpdesk" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HELPDESK, ROLES.EMPLOYEE]}>
            <HelpDesk />
          </PrivateRoute>
        } />

        {/* ── Asset Module ── */}
        <Route path="/asset-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.ASSET]}>
            <AssetDashboard />
          </PrivateRoute>
        } />
        <Route path="/asset" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.ASSET]}>
            <Asset />
          </PrivateRoute>
        } />

        {/* ── Recruitment Module ── */}
        <Route path="/recruitment-dashboard" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <RecruitmentDashboard />
          </PrivateRoute>
        } />
        <Route path="/recruitment" element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <Recruitment />
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