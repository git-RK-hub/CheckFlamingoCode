const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  subType: {
    type: String,
    default: "lecture",
  },

  lectureName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  youtubeURL: {
    type: String,
  },
  videoId: {
    type: String,
  },
});
module.exports = mongoose.model("Lecture", lectureSchema);
