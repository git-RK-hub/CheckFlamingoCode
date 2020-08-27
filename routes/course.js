const express = require("express");
const router = express.Router();
const { courseValidator } = require("../validator/index");
const { instructorById, isInstructor } = require("../controllers/instructor");
const {
  create,
  list,
  update,
  remove,
  courseId,
  finish,
  read,
  createWithImage,
  updateWithImage,
  sendMessageToAdmin1,
  findInstructor,
  updateCourse,
  sendMessageToAdmin1ApprovedCourse,
} = require("../controllers/course");
const {
  requiresSignin,
  handleErrorNext,
  findRole,
} = require("../controllers/auth");
router.post(
  "/course/create",
  requiresSignin,
  handleErrorNext,
  courseValidator,
  findInstructor,
  create
);
router.post(
  "/course/createWithImage",
  requiresSignin,
  handleErrorNext,
  createWithImage,
  courseValidator,
  findInstructor,
  create
);
router.get("/courses", list); //not ins
router.get("/course/:courseId", read); //not ins
router.put(
  "/course/update/:courseId",
  requiresSignin,
  handleErrorNext,
  courseValidator,
  update
);
router.put(
  "/course/updateWithImage/:courseId",
  requiresSignin,
  handleErrorNext,
  updateWithImage,
  courseValidator,
  update
);
router.delete(
  "/course/remove/:courseId",
  requiresSignin,
  handleErrorNext,
  findRole,
  remove
);
router.put(
  "/course/updateApprovedCourse/:courseId",
  requiresSignin,
  handleErrorNext,
  updateCourse,
  sendMessageToAdmin1ApprovedCourse
);
router.put(
  "/course/finish/:courseId",
  requiresSignin,
  handleErrorNext,
  finish,
  sendMessageToAdmin1
);
router.param("courseId", courseId);
router.param("instructorId", instructorById);
module.exports = router;
