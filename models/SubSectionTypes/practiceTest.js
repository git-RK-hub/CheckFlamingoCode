const mongoose = require("mongoose");

const practiceTestSchema = new mongoose.Schema({
  subType: {
    type: String,
    default: "practiceTest",
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
module.exports = mongoose.model("PracticeTest", practiceTestSchema);
