const mongoose = require("mongoose");

const codingExerciseSchema = new mongoose.Schema({
  subType: {
    type: String,
    default: "codingExercise",
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
module.exports = mongoose.model("CodingExercise", codingExerciseSchema);
