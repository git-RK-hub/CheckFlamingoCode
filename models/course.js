const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Section = require("./section");
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    unique: true,
    required: true,
  },
  leaderBoard: {
    type: Map,
    of: Array,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  departments: {
    type: String,
  },
  instructorId: {
    type: ObjectId,
    ref: "Instructor",
  },
  prerequisites: {
    type: Array,
    required: true,
  },
  sections: [Section.schema],
  skillLevel: {
    type: String,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  courseType: {
    type: String,
  },
  tags: {
    type: Array,
  },
  sems: {
    type: Array,
  },
  imgUrl: {
    type: String,
  },
  instructorName: {
    type: String,
  },
  totalSubSections: {
    type: Number,
    default: 0,
  },
  introUrl: {
    type: String,
  },
  approved: {
    type: Boolean,
  },
  videoId: {
    type: String,
  },
  b2c: {
    type: Boolean,
    default: true,
  },
  dup: {
    _id: {
      type: mongoose.Schema.ObjectId,
    },
    courseName: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    departments: {
      type: String,
    },
    instructorId: {
      type: ObjectId,
      ref: "Instructor",
    },
    prerequisites: {
      type: Array,
      required: true,
    },
    sections: [Section.schema],
    skillLevel: {
      type: String,
    },
    submitted: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    courseType: {
      type: String,
    },
    tags: {
      type: Array,
    },
    sems: {
      type: Array,
    },
    imgUrl: {
      type: String,
    },
    instructorName: {
      type: String,
    },
    totalSubSections: {
      type: Number,
      default: 0,
    },
    introUrl: {
      type: String,
    },
    approved: {
      type: Boolean,
    },
    videoId: {
      type: String,
    },
    b2c: {
      type: Boolean,
      default: true,
    },
    university: {
      type: String,
    },
    dupActive: {
      type: Boolean,
      default: false,
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dupActive: {
    type: Boolean,
    default: false,
  },
  university: {
    type: String,
  },
});
const Course = (module.exports = mongoose.model("Course", courseSchema));
