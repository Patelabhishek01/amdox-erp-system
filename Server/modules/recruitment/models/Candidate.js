const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    appliedPosition: {
      type: String,
      trim: true,
      default: "",
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Screening",
        "Interview",
        "Interviewing",
        "Offered",
        "Hired",
        "Rejected",
      ],
      default: "Applied",
    },
    experience: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    interviewNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate synchronization to keep both the legacy and the new field names in sync
candidateSchema.pre("validate", function (next) {
  if (this.name && !this.candidateName) this.candidateName = this.name;
  if (this.candidateName && !this.name) this.name = this.candidateName;

  if (this.appliedPosition && !this.position) this.position = this.appliedPosition;
  if (this.position && !this.appliedPosition) this.appliedPosition = this.position;

  if (this.interviewNotes && !this.notes) this.notes = this.interviewNotes;
  if (this.notes && !this.interviewNotes) this.interviewNotes = this.notes;

  next();
});

module.exports = mongoose.model("Candidate", candidateSchema);