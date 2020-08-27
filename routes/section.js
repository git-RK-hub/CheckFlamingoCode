const express = require("express");
const router = express.Router();

const { courseId } = require("../controllers/course");
const {
  create,
  list,
  sectionId,
  update,
  remove,
  read,
} = require("../controllers/section");
const { sectionValidator } = require("../validator/index");
const { requiresSignin, handleErrorNext } = require("../controllers/auth");
router.post(
  "/course/:courseId/section/create",
  requiresSignin,
  handleErrorNext,
  sectionValidator,
  create
);
router.get("/course/:courseId/sections", requiresSignin, handleErrorNext, list);
router.get(
  "/course/:courseId/section/read/:sectionId",
  requiresSignin,
  handleErrorNext,
  read
);
router.put(
  "/course/:courseId/section/update/:sectionId",
  requiresSignin,
  handleErrorNext,
  sectionValidator,
  update
);
router.delete(
  "/course/:courseId/section/remove/:sectionId",
  requiresSignin,
  handleErrorNext,
  remove
);
router.param("courseId", courseId);
router.param("sectionId", sectionId);

module.exports = router;
