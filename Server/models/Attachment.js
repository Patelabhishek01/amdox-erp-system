const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  recordId: { type: String, required: true },
  module: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attachment", attachmentSchema);
