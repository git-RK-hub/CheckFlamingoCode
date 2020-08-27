const mongoose = require("mongoose");
const CartItem = require("./cartItem");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    orderItems: [CartItem.schema],
    transaction_id: {},
    amount: { type: Number },
    status: {
      type: String,
      default: "Pending",
      enum: ["Successfull", "Failed", "Pending"],
    },
    user: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
