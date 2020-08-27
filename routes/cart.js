const express = require("express");
const {
  cartList,
  addToCart,
  removeFromCart,
  addToCartMultiple,
} = require("../controllers/cart");
const { userById } = require("../controllers/user");
const { requiresSignin, handleErrorNext } = require("../controllers/auth");
const router = express.Router();
router.get("/cart/:userId/cartList", requiresSignin, handleErrorNext, cartList);
router.post(
  "/cart/:userId/addToCart",
  requiresSignin,
  handleErrorNext,
  addToCart
);
router.post(
  "/cart/:userId/addToCartMultiple",
  requiresSignin,
  handleErrorNext,
  addToCartMultiple
); //signedin,user

router.delete(
  "/cart/:userId/:courseId/removeFromCart",
  requiresSignin,
  handleErrorNext,
  removeFromCart
); //signedin,user
router.param("userId", userById);
module.exports = router;
