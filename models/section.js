const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subSections: [],
});
module.exports = mongoose.model("Section", sectionSchema);
