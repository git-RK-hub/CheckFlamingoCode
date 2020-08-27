const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const { baseUserSchema } = require("./baseUser");
const adminSchema = new baseUserSchema({
  isActive: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: String,
    default: null,
  },
  level: {
    type: Number,
  },
  hash: {
    type: String,
  },
  university: {
    type: String,
  },
  departments: {
    type: Array,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
