const Razorpay = require("razorpay");
const shortid = require("shortid");
const crypto = require("crypto");
const Order = require("../models/orders");
const User = require("../models/user");
const { response } = require("express");
const razorpay = new Razorpay({
  key_id: "rzp_live_AdpTTtkfdDulrn",
  key_secret: "7Pzk9SbjEc9hm5N7AMw9WmD5",
});

exports.checkout = async function (req, res) {
  console.log("I was hit");
  const user = req.profile;
  let totalAmount = 0;
  user.cart.forEach((element) => {
    totalAmount += parseInt(
      element.price - element.price * element.discount * 0.01
    );
  });
  const payment_capture = 1;
  const amount = totalAmount;
  const currency = "INR";
  console.log(amount);
  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    const order = new Order({
      orderItems: user.cart,
      transaction_id: { response },
      amount: amount,
      user: user,
    });
    order.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Something went wrong" });
      } else
        return res.status(200).json({
          id: response.id,
          currency: response.currency,
          amount: response.amount,
          name: "Flamingo",
          key: "rzp_live_AdpTTtkfdDulrn",
          description: "Course enrollment fee",
          username: user.username,
          email: user.email,
        });
    });
  } catch (error) {
    console.log(error);
  }
};
exports.verifyPayemnt = (req, res) => {
  razorpay_order_id = req.body.orderId;
  razorpay_payment_id = req.params.paymentId;
  secret = "7Pzk9SbjEc9hm5N7AMw9WmD5";
  var generatedSignature = crypto
    .createHmac("SHA256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  console.log(req.body.signature, generatedSignature);
  if (req.body.signature === generatedSignature) {
    Order.findOneAndUpdate(
      { "transaction_id.response.id": req.body.orderId },
      { status: "Successfull" },
      (err, doc) => {
        if (err) return res.status(400).json({ error: "Something went wrong" });
        else {
          User.findById(doc.user, (err, user) => {
            if (err)
              return res.status(400).json({ error: "Something went wrong" });
            for (let index = 0; index < user.cart.length; index++) {
              user.myCoursesList.push({
                course: user.cart[index].course,
              });
            }
            user.cart = [];
            user.markModified("myCourses");
            user.save((err, savedUser) => {
              if (err)
                return res.status(400).json({ error: "Something went wrong" });
              else
                return res.status(200).json({ message: "Payment succesfull" });
            });
          });
        }
      }
    );
  } else
    return res
      .status(400)
      .json({ error: "Payment couldnot be verified please try again" });
};
