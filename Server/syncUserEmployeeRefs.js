require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./modules/auth/models/user");
const Employee = require("./modules/hr/models/employee");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, running bidirectional User <-> Employee sync...");
    
    const users = await User.find();
    console.log(`Found ${users.length} users in database.`);

    let createdCount = 0;
    let linkedCount = 0;

    for (const user of users) {
      let employee = null;

      // 1. Search by user.employee ref if already present
      if (user.employee) {
        employee = await Employee.findById(user.employee);
      }

      // 2. Search by employee.userId
      if (!employee) {
        employee = await Employee.findOne({ userId: user._id });
      }

      // 3. Search by employee.email
      if (!employee) {
        employee = await Employee.findOne({ email: user.email });
      }

      // 4. If no employee document exists, create one
      if (!employee) {
        const employeeId = `EMP-${Math.floor(100000 + Math.random() * 900000)}`;
        employee = new Employee({
          employeeId,
          name: user.name,
          email: user.email,
          userId: user._id,
          department: "Operations",
          designation: user.role === "Admin" ? "Administrator" : "Staff Member",
          salary: user.role === "Admin" ? 100000 : 30000,
          joiningDate: new Date(),
          status: "Active"
        });
        await employee.save();
        createdCount++;
        console.log(`Created new Employee record for ${user.email} (ID: ${employeeId})`);
      }

      // Ensure bidirectional references are up to date
      let employeeModified = false;
      let userModified = false;

      if (!employee.userId || employee.userId.toString() !== user._id.toString()) {
        employee.userId = user._id;
        employeeModified = true;
      }

      if (!user.employee || user.employee.toString() !== employee._id.toString()) {
        user.employee = employee._id;
        userModified = true;
      }

      if (employeeModified) {
        await employee.save();
      }
      if (userModified) {
        await user.save({ validateModifiedOnly: true });
        linkedCount++;
        console.log(`Linked User ${user.email} with Employee ${employee.employeeId}`);
      }
    }

    console.log(`Sync completed! Created: ${createdCount}, Linked/Updated: ${linkedCount}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  });
