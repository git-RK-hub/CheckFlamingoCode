const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const admin1Schema = new mongoose.Schema({
  coursePermissions: [
    {
      course: {
        type: ObjectId,
        ref: "Course",
      },
      status: {
        type: Boolean,
      },
    },
  ],
  courseApprovedPermissions: [
    {
      course: {
        type: ObjectId,
        ref: "Course",
      },
      status: {
        type: Boolean,
      },
    },
  ],
  blogPermissions: [
    {
      blog: {
        type: ObjectId,
        ref: "Blog",
      },
      status: {
        type: Boolean,
      },
    },
  ],
});

module.exports = mongoose.model("Admin1", admin1Schema);
