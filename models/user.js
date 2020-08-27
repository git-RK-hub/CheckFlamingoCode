const mongoose = require("mongoose");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;
const CartItem = require("./cartItem");
const { baseUserSchema } = require("./baseUser");
const userSchema = new baseUserSchema({
  myCoursesList: [
    {
      course: {
        type: ObjectId,
        ref: "Course"
      },
      userProgress: {
        type: Map,
        of: Object
      },
      progress: {
        type: Number,
        default: 0
      },
      totalSubmissions: {
        type: Number,
        default: 0
      },
      qns: {
        type: Map,
        of: Array
      },
      marks: {
        type: Map,
        of: Array
      }
    }
  ],
  ofClass: {
    type: Number,
    required: true
  },
  classSection: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.ObjectId,
    ref: "ClassModel"
  },
  active: {
    type: Boolean,
    default: true
  },
  hash: {
    type: String,
    default: null
  },
  createdDate: {
    type: String,
    default: null
  },
  credits: {
    type: Number,
    default: 0
  },
  history: {
    type: Array,
    default: []
  },
  cart: [CartItem.schema],
  socialMediaHandles: {
    type: Map,
    of: String
  },
  department: {
    type: String
  },
  sem: {
    type: String
  },
  university: {
    type: String
  },
  myMockSlots: [
    {
      date: {
        type: Date
      },
      from: {
        type: String
      },
      to: {
        type: String
      },
      content: {
        type: String
      },
      mockSlotId: {
        type: String
      }
    }
  ]
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "classId",
    select: "sessions"
  });
  next();
});

module.exports = mongoose.model("User", userSchema);
