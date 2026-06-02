import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";
import HRSubNav from "./components/HRSubNav";

const attendanceData = [
  {
    employeeId: "EMP001",
    name: "John Smith",
    date: "2026-05-15",
    checkIn: "09:00 AM",
    checkOut: "06:15 PM",
    status: "Present",
  },
  {
    employeeId: "EMP002",
    name: "Sarah Johnson",
    date: "2026-05-15",
    checkIn: "09:12 AM",
    checkOut: "06:05 PM",
    status: "Late",
  },
  {
    employeeId: "EMP003",
    name: "Michael Brown",
    date: "2026-05-15",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
  },
];

export default function Attendance() {
  return (
    <MainLayout>
      <HRSubNav />
      <PageHeader
        title="Attendance"
        subtitle="Track employee attendance and working hours"
        actionText="Mark Attendance"
        onAction={() =>
          alert("Attendance marking functionality will be added.")
        }
      />

      {/* Attendance Table */}
      <div className="card">
        <div className="card-header">
          <h3>Today's Attendance</h3>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index}>
                  <td>{record.employeeId}</td>
                  <td>{record.name}</td>
                  <td>{record.date}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                  <td>
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}