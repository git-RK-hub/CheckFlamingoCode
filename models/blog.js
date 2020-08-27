const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  createdDate: {
    type: String,
  },
  category: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  imgUrl: {
    type: String,
  },
});
module.exports = mongoose.model("Blog", blogSchema);
