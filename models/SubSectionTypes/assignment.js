const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  subType: {
    type: String,
    default: "assignment",
  },
  content: {
    type: String,
  },
  fileName: {
    type: String,
    default: null,
  },
  ansFileName: {
    type: String,
    default: null,
  },
  ansContent: {
    type: String,
  },
  marks: {
    type: Number,
  },
});
module.exports = mongoose.model("Assignment", assignmentSchema);
