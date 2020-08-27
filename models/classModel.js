const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  ofClass: {
    type: Number,
    required: true
  },
  classSection: {
    type: String,
    required: true
  },
  sessions: [
    {
      instructor: {
        type: mongoose.Schema.ObjectId,
        ref: "Instructor"
      },
      title: String,
      startDate: Date,
      endDate: Date,
      eventURL: String
    }
  ]
});

classSchema.pre(/^find/, function (next) {
  this.populate({
    path: "instructor",
    select: "professorName"
  });
  next();
});

const ClassModel = mongoose.model("ClassModel", classSchema);

module.exports = ClassModel;
