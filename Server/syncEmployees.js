require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./modules/auth/models/user");
const Employee = require("./modules/hr/models/employee");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, syncing employees...");
    
    const users = await User.find();
    console.log(`Found ${users.length} users in total.`);

    let createdCount = 0;
    let updatedCount = 0;
    for (const user of users) {
      let existingEmployee = await Employee.findOne({ userId: user._id });
      
      if (!existingEmployee) {
        // Check if an employee with the same email already exists
        existingEmployee = await Employee.findOne({ email: user.email });
        if (existingEmployee) {
          // Link them
          existingEmployee.userId = user._id;
          if (!existingEmployee.designation) {
            existingEmployee.designation = user.role === "Admin" ? "Administrator" : "Staff Member";
          }
          await existingEmployee.save();
          console.log(`Linked existing employee ${user.email} with User ID: ${user._id}`);
          updatedCount++;
          continue;
        }

        // Create a new employee profile for this user
        const employeeId = `EMP-${Math.floor(100000 + Math.random() * 900000)}`;
        const newEmployee = new Employee({
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
        await newEmployee.save();
        console.log(`Created employee profile for ${user.email} (ID: ${employeeId})`);
        createdCount++;
      } else {
        console.log(`Employee profile already exists for ${user.email}`);
      }
    }

    console.log(`Sync complete! Created ${createdCount} profiles, updated ${updatedCount} profiles.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
