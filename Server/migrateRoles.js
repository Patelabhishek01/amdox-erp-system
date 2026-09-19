require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./modules/auth/models/user");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, running migration...");
    
    // Migrate roles to match standard
    const resAdmin = await User.updateMany({ role: "admin" }, { $set: { role: "Admin" } });
    console.log("Migrated 'admin' -> 'Admin':", resAdmin.modifiedCount);

    const resUser = await User.updateMany({ role: "user" }, { $set: { role: "Employee" } });
    console.log("Migrated 'user' -> 'Employee':", resUser.modifiedCount);
    
    const resEmployee = await User.updateMany({ role: "employee" }, { $set: { role: "Employee" } });
    console.log("Migrated 'employee' -> 'Employee':", resEmployee.modifiedCount);

    console.log("Migration complete!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
