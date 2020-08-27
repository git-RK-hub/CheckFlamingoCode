const mongoose = require("mongoose");

const degreeSchema = new mongoose.Schema({
  degreeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  courses: {},
});
module.exports = mongoose.model("Degree", degreeSchema);
