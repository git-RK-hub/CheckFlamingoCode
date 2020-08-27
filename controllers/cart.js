const CartItem = require("../models/cartItem");
exports.addToCart = function (req, res) {
  const cart = new CartItem({
    course: req.body.courseId,
    courseName: req.body.courseName,
    price: req.body.price,
    discount: req.body.discount,
    imgUrl: req.body.imgUrl,
  });
  const user = req.profile;
  user.cart.push(cart);
  console.log(cart);
  user.save((err, data) => {
    if (err) return res.status(400).json({ error: err });
    else return res.status(200).json({ message: "Cart item added" });
  });
};
exports.removeFromCart = function (req, res) {
  const user = req.profile;
  const courseId = req.params.courseId;
  cartIndex = user.cart.findIndex((obj) => {
    return obj.course == courseId;
  });
  user.cart.splice(cartIndex, 1);
  user.save((err, data) => {
    if (err) return res.status(400).json({ error: err });
    else return res.status(200).json({ message: "Cart item Removed" });
  });
};
exports.addToCartMultiple = async function (req, res) {
  const cart = req.body.cart;
  const user = req.profile;
  const userCart = user.cart;
  const myCourses = user.myCoursesList;
  console.log(userCart);

  for (index = 0; index < cart.length; index++) {
    if (
      userCart.findIndex(
        (element) => element.course.toString() === cart[index]._id
      ) !== -1
    )
      continue;
    if (
      myCourses.findIndex(
        (element) => element.course.toString() === cart[index]._id
      ) !== -1
    )
      continue;
    let tempCart = new CartItem({
      course: cart[index]._id,
      courseName: cart[index].courseName,
      price: cart[index].price,
      imgUrl: cart[index].imgUrl,
      discount: cart[index].discount,
    });
    userCart.push(tempCart);
    console.log(userCart);
  }
  user.save((err, data) => {
    if (err) return res.status(400).json({ error: err });
    else return res.status(200).json({ message: "Cart items added" });
  });
};
exports.cartList = function (req, res) {
  const user = req.profile;
  return res.status(200).json({ cart: user.cart });
};
exports.signInCart = function (req, res) {};
