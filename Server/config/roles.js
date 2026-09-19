const ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  HR_MANAGER: "HR Manager",
  HR_EXECUTIVE: "HR Executive",
  FINANCE_MANAGER: "Finance Manager",
  ACCOUNTANT: "Accountant",
  CRM_MANAGER: "CRM Manager",
  SALES_MANAGER: "Sales Manager",
  SALES_EXECUTIVE: "Sales Executive",
  INVENTORY_MANAGER: "Inventory Manager",
  STORE_KEEPER: "Store Keeper",
  PURCHASE_MANAGER: "Purchase Manager",
  PROJECT_MANAGER: "Project Manager",
  HELP_DESK_AGENT: "Help Desk Agent",
  ASSET_MANAGER: "Asset Manager",
  RECRUITER: "Recruiter",
  EMPLOYEE: "Employee",
};

const ALL_ROLES = Object.values(ROLES);

module.exports = {
  ROLES,
  ALL_ROLES
};
