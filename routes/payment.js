const express = require("express");
const router = express.Router();
const { checkout, verifyPayemnt } = require("../controllers/payment");
const { userById } = require("../controllers/user");
const { requiresSignin, handleErrorNext } = require("../controllers/auth");

router.post("/:userId/checkout", requiresSignin, handleErrorNext, checkout);
router.post(
  "/capture/:paymentId",
  requiresSignin,
  handleErrorNext,
  verifyPayemnt
);
router.param("userId", userById);

module.exports = router;
