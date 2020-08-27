const express = require("express");
const { create, list, liveById } = require("../controllers/livesessionb2b");
const { requiresSignin, handleErrorNext } = require("../controllers/auth");
const { isAdmin1 } = require("../controllers/admin");
const router = express.Router();

router.post(
  "/liveb2b/create",
  requiresSignin,
  handleErrorNext,
  // isAdmin1,
  create
);
router.get(
  "/liveb2b/:university/:department/:sem",
  requiresSignin,
  handleErrorNext,
  list
);
router.get("/liveb2b/:id", requiresSignin, handleErrorNext, liveById);
module.exports = router;
