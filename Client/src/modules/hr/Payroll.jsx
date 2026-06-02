import { useState } from "react";

import HRSubNav from "./components/HRSubNav";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";

const initialPayroll = [
  {
    employeeId: "EMP001",
    employeeName: "John Smith",
    month: "May 2026",
    basicSalary: 50000,
    bonus: 5000,
    deductions: 2000,
    netSalary: 53000,
    status: "Paid",
  },
  {
    employeeId: "EMP002",
    employeeName: "Sarah Johnson",
    month: "May 2026",
    basicSalary: 42000,
    bonus: 3000,
    deductions: 1500,
    netSalary: 43500,
    status: "Pending",
  },
];

export default function Payroll() {
  const [payrollRecords, setPayrollRecords] =
    useState(initialPayroll);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    month: "",
    basicSalary: "",
    bonus: "",
    deductions: "",
  });

  /* =========================
     Handle Form Input
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     Generate Payroll
  ========================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const basic =
      Number(formData.basicSalary) || 0;
    const bonus =
      Number(formData.bonus) || 0;
    const deductions =
      Number(formData.deductions) || 0;

    const netSalary =
      basic + bonus - deductions;

    const newRecord = {
      ...formData,
      netSalary,
      status: "Pending",
    };

    setPayrollRecords([
      ...payrollRecords,
      newRecord,
    ]);

    setFormData({
      employeeId: "",
      employeeName: "",
      month: "",
      basicSalary: "",
      bonus: "",
      deductions: "",
    });
  };

  /* =========================
     Mark Payroll as Paid
  ========================= */
  const markAsPaid = (index) => {
    const updated = [...payrollRecords];
    updated[index].status = "Paid";
    setPayrollRecords(updated);
  };

  return (
    <MainLayout>
      <HRSubNav />
      <PageHeader
        title="Payroll"
        subtitle="Generate and process employee salaries"
        actionText="Generate Payroll"
        onAction={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      />

      {/* Payroll Form */}
      <div className="card">
        <div className="card-header">
          <h3>Payroll Generation</h3>
        </div>

        <div className="card-body">
          <form
            onSubmit={handleSubmit}
            className="form-grid"
          >
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="employeeName"
              placeholder="Employee Name"
              value={formData.employeeName}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="month"
              placeholder="Month (e.g. May 2026)"
              value={formData.month}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="number"
              name="basicSalary"
              placeholder="Basic Salary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="number"
              name="bonus"
              placeholder="Bonus"
              value={formData.bonus}
              onChange={handleChange}
              className="form-input"
            />

            <input
              type="number"
              name="deductions"
              placeholder="Deductions"
              value={formData.deductions}
              onChange={handleChange}
              className="form-input"
            />

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Generate Payroll
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card">
        <div className="card-header">
          <h3>Payroll Records</h3>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Month</th>
                <th>Basic Salary</th>
                <th>Bonus</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payrollRecords.length > 0 ? (
                payrollRecords.map(
                  (record, index) => (
                    <tr key={index}>
                      <td>{record.employeeId}</td>
                      <td>
                        {record.employeeName}
                      </td>
                      <td>{record.month}</td>
                      <td>
                        ₹
                        {Number(
                          record.basicSalary
                        ).toLocaleString()}
                      </td>
                      <td>
                        ₹
                        {Number(
                          record.bonus
                        ).toLocaleString()}
                      </td>
                      <td>
                        ₹
                        {Number(
                          record.deductions
                        ).toLocaleString()}
                      </td>
                      <td>
                        ₹
                        {Number(
                          record.netSalary
                        ).toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge
                          status={record.status}
                        />
                      </td>
                      <td>
                        {record.status !==
                          "Paid" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              markAsPaid(index)
                            }
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="empty-state"
                  >
                    No payroll records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}