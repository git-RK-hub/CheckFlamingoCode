const express = require("express");
const router = express.Router();
const { verifyInstructor } = require("../helpers/emailHandler");
const {
  signUpInstructor,
  hashIdInstructor,
  listCourses,
  instructorById,
  myMessages,
  doNotReply,
  myCourseId,
  replyToQn,
  findUser,
  mySubmissions,
  instructorRead,
  changePassword,
  changeProfile,
  allocateMarks,
  findClass,
  findSession,
  checkSession,
  createSession,
  updateSession,
  deleteSession,
  getClass
} = require("../controllers/instructor");
const { checkAdmin, departments } = require("../controllers/admin");
const {
  checkUser,
  requiresSignin,
  handleErrorNext
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator/index");
const { courseId } = require("../controllers/course");
router.get("/verifyInstructor/:hashId", verifyInstructor);
router.post(
  "/instructor/signup/:hashId",
  userSignupValidator,
  checkAdmin,
  checkUser,
  signUpInstructor
);
router.get(
  "/instructor/listCourses/:instructorId",
  requiresSignin,
  handleErrorNext,
  listCourses
);
router.get("/instructor/:instructorId", instructorRead);
router.post("/instructor/Depts", requiresSignin, handleErrorNext, departments);
router.put(
  "/instructor/changeProfile/:instructorId",
  requiresSignin,
  handleErrorNext,
  checkAdmin,
  checkUser,
  changeProfile
);
router.put(
  "/instructor/changePassword/:instructorId",
  requiresSignin,
  handleErrorNext,
  changePassword
);
router.get(
  "/instructor/myMessages/:instructorId",
  requiresSignin,
  handleErrorNext,
  myMessages
);
router.get(
  "/instructor/mySubmissions/:instructorId/:courseId",
  requiresSignin,
  handleErrorNext,
  mySubmissions
);
router.post(
  "/instructor/donotReply/:instructorId",
  requiresSignin,
  handleErrorNext,
  doNotReply
);
router.post(
  "/instructor/replytoQn/:instructorId",
  requiresSignin,
  handleErrorNext,
  findUser,
  myCourseId,
  replyToQn
);

router.post(
  "/instructor/:instructorId/allocateMarks/:courseId",
  requiresSignin,
  handleErrorNext,
  findUser,
  allocateMarks
);

router.post(
  "/instructor/:instructorId/createSession",
  requiresSignin,
  handleErrorNext,
  findClass,
  checkSession,
  createSession
);

router.patch(
  "/instructor/:instructorId/updateSession",
  requiresSignin,
  handleErrorNext,
  findClass,
  findSession,
  updateSession
);

router.patch(
  "/instructor/:instructorId/deleteSession",
  requiresSignin,
  handleErrorNext,
  findClass,
  findSession,
  deleteSession
);

router.post(
  "/instructor/:instructorId/getClass",
  requiresSignin,
  handleErrorNext,
  getClass
);

router.param("instructorId", instructorById);
router.param("hashId", hashIdInstructor);
module.exports = router;
