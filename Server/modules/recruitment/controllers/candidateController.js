const Candidate = require("../models/Candidate");
const User = require("../../auth/models/user");
const Employee = require("../../hr/models/employee");
const bcrypt = require("bcryptjs");

// Create Candidate
exports.createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create candidate",
      error: error.message,
    });
  }
};

// Get All Candidates (with search)
exports.getCandidates = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const candidates = await Candidate.find({
      $or: [
        { candidateName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch candidates",
      error: error.message,
    });
  }
};

// Get Single Candidate
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch candidate",
      error: error.message,
    });
  }
};

// Update Candidate
exports.updateCandidate = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find candidate first to check old status
    const candidateBefore = await Candidate.findById(req.params.id);
    if (!candidateBefore) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    const oldStatus = candidateBefore.status;

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // If candidate status is updated to "Hired"
    if ((status === "Hired" || candidate.status === "Hired") && oldStatus !== "Hired") {
      try {
        // 1. Create/find User account
        let user = await User.findOne({ email: candidate.email });
        if (!user) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("HiredPass123!", salt);
          
          user = new User({
            name: candidate.candidateName || candidate.name,
            email: candidate.email,
            password: hashedPassword,
            role: "Employee"
          });
          await user.save();
        }

        // 2. Create/find active HR Employee document
        let employee = await Employee.findOne({ email: candidate.email });
        if (!employee) {
          employee = new Employee({
            employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: candidate.candidateName || candidate.name,
            email: candidate.email,
            department: "Operations",
            designation: candidate.position || candidate.appliedPosition || "Staff Member",
            salary: 30000,
            joiningDate: Date.now(),
            status: "Active",
            userId: user._id
          });
          await employee.save();
        }
        console.log(`Successfully created User and Employee records for Hired candidate: ${candidate.candidateName}`);
      } catch (triggerError) {
        console.error("Failed to automatically create User/Employee records on Hire:", triggerError);
      }
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update candidate",
      error: error.message,
    });
  }
};

// Delete Candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete candidate",
      error: error.message,
    });
  }
};