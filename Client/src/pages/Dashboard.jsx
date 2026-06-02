import {
  FaUsers,
  FaWallet,
  FaBoxes,
  FaShoppingCart,
} from "react-icons/fa";

import MainLayout from "../components/layout/MainLayout";
import KPICard from "../components/ui/KPICard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";

const recentOrders = [
  {
    orderId: "SO-1001",
    customer: "Acme Corporation",
    amount: "$12,500",
    status: "Completed",
  },
  {
    orderId: "SO-1002",
    customer: "Global Tech Ltd.",
    amount: "$8,750",
    status: "Pending",
  },
  {
    orderId: "SO-1003",
    customer: "Prime Solutions",
    amount: "$15,200",
    status: "In Progress",
  },
  {
    orderId: "SO-1004",
    customer: "Vision Enterprises",
    amount: "$5,900",
    status: "Cancelled",
  },
];

const columns = [
  { key: "orderId", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  {
    key: "status",
    label: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
];

export default function Dashboard() {
  return (
    <MainLayout>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total Employees"
          value="248"
          icon={<FaUsers />}
          change="12.5%"
          trend="up"
        />

        <KPICard
          title="Monthly Revenue"
          value="$185,400"
          icon={<FaWallet />}
          change="8.2%"
          trend="up"
        />

        <KPICard
          title="Inventory Items"
          value="3,426"
          icon={<FaBoxes />}
          change="2.1%"
          trend="up"
        />

        <KPICard
          title="Sales Orders"
          value="154"
          icon={<FaShoppingCart />}
          change="4.7%"
          trend="down"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3>Revenue Overview</h3>
          </div>
          <div className="chart-placeholder">
            Revenue chart will be integrated here.
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Department Summary</h3>
          </div>
          <div className="chart-placeholder">
            Department chart will be integrated here.
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <DataTable
        title="Recent Sales Orders"
        columns={columns}
        data={recentOrders}
      />
    </MainLayout>
  );
}