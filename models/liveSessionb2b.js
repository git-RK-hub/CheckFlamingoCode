const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const liveb2b = new mongoose.Schema({
  professorName: {
    type: String,
  },
  department: {
    type: String,
  },
  semesters: {
    type: Array,
  },
  sessionDate: {
    type: Date,
  },
  sessionDescription: {
    type: String,
  },
  university: {
    type: String,
  },
  sessionUrl: {
    type: String,
  },
  liveUrlId: {
    type: String,
  },
});
module.exports = mongoose.model("Liveb2b", liveb2b);
