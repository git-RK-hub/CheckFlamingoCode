const express = require("express");
const { create, list, register } = require("../controllers/mock");
const { isAdmin2, adminById } = require("../controllers/admin");
const { requiresSignin, handleErrorNext } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();
router.post(
  "/admin/:adminId/createMock",
  requiresSignin,
  handleErrorNext,
  isAdmin2,
  create
);
router.get("/mock/list", requiresSignin, handleErrorNext, list);
router.post("/mock/userId", requiresSignin, handleErrorNext, register);
router.param("userId", userById);
router.param("adminId", adminById);

module.exports = router;
