const Candidate = require("../models/Candidate");

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
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
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