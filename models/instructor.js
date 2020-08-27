const mongoose = require("mongoose");
const { baseUserSchema } = require("./baseUser");
const { ObjectId } = mongoose.Schema;

const instructorSchema = new baseUserSchema({
  coursesByMe: [
    {
      course: {
        type: ObjectId,
        ref: "Course",
      },
      submissions: {
        type: Map,
        of: Array,
      },
    },
  ],
  active: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: String,
    default: null,
  },
  hash: {
    type: String,
    default: null,
  },
  messages: [],
  role: {
    type: Number,
  },
  university: {
    type: String,
  },
  department: {
    type: String,
  },
  classes: {
    type: Array,
  },
  classSection: {
    type: Array,
  },
});
instructorSchema.methods.deleteACourse = function (courseId) {
  let i;
  let courses = this.coursesByMe;
  courses.forEach(function (element, index) {
    if (element.course.toString() === courseId.toString()) {
      i = index;
    }
  });
  this.coursesByMe.splice(i, 1);
  return new Promise((resolve, reject) => {
    this.save((err, rep) => {
      if (err) reject("Something went wrong");
      else resolve({ result: rep });
    });
  });
};
module.exports = mongoose.model("Instructor", instructorSchema);
