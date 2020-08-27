const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
  {
    course: { type: ObjectId, ref: "Course" },
    courseName: String,
    price: Number,
    imgUrl: {
      type: String,
    },
    discount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem", CartItemSchema);
