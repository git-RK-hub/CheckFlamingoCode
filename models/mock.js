const mongoose = require("mongoose");

const mockSchema = new mongoose.Schema({
  interviewDate: {
    type: Date,
  },
  from: { type: String },
  to: { type: String },
  slots: { type: Number },
  availableSlots: { type: Number },
});

module.exports = mongoose.model("Mock", mockSchema);
