const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const quizSchema = new mongoose.Schema({
  subType: {
    type: String,
    default: "quiz",
  },
  questions: [],
});
module.exports = mongoose.model("Quiz", quizSchema);
