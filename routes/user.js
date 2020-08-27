const express = require("express");
const router = express.Router();
const {
  requiresSignin,
  isAuth,
  handleErrorNext,
  checkUser
} = require("../controllers/auth");

const {
  userById,
  read,
  myCourses,
  updateProgress,
  myCoursesCats,
  myCourseId,
  getProgressOfCourse,
  postQn,
  findInstructor,
  parseFields,
  findCourseInInstructor,
  submitWithFile,
  submitwithContent,
  savewithContent,
  changePassword,
  changeProfile,
  hashIdUser,
  signUpb2bUser,
  enrollInClass,
  findSessions
} = require("../controllers/user");
const { courseId } = require("../controllers/course");
const { sendQuery, liveDemo } = require("../controllers/query");
const { checkAdmin } = require("../controllers/admin");
const { checkInstructor } = require("../controllers/instructor");
const { userSignupValidator } = require("../validator");
router.get("/user/:userId", requiresSignin, handleErrorNext, isAuth, read);
router.post("/query", sendQuery);
router.post("/liveDemo", liveDemo);
router.get(
  "/user/:userId/myCourses",
  requiresSignin,
  handleErrorNext,
  myCourses
);
router.get(
  "/user/:userId/myCoursesCats",
  requiresSignin,
  handleErrorNext,
  myCoursesCats
);
router.put(
  "/user/changePassword/:userId",
  requiresSignin,
  handleErrorNext,
  changePassword
);
router.put(
  "/user/changeProfile/:userId",
  requiresSignin,
  handleErrorNext,
  checkAdmin,
  checkInstructor,
  changeProfile
);
router.post(
  "/user/:userId/myCoursesProg/:myCourseId",
  requiresSignin,
  handleErrorNext,
  updateProgress
);
router.post(
  "/user/:userId/postQn/:myCourseId",
  requiresSignin,
  handleErrorNext,
  findInstructor,
  postQn
);
router.get(
  "/user/:userId/getmyCourseProg/:myCourseId",
  requiresSignin,
  handleErrorNext,
  getProgressOfCourse
);
router.post(
  "/user/:userId/submitWithFile/:myCourseId",
  requiresSignin,
  handleErrorNext,
  parseFields,
  findInstructor,
  findCourseInInstructor,
  submitWithFile
);
router.post(
  "/user/:userId/submitWithContent/:myCourseId",
  requiresSignin,
  handleErrorNext,
  findInstructor,
  findCourseInInstructor,
  submitwithContent
);
router.post(
  "/user/:userId/saveWithContent/:myCourseId",
  requiresSignin,
  handleErrorNext,
  savewithContent
);
router.post(
  "/b2bUser/signup/:hashId",
  userSignupValidator,
  checkAdmin,
  checkUser,
  signUpb2bUser
);

router.get(
  "/user/:userId/findSessions",
  requiresSignin,
  handleErrorNext,
  findSessions
);

router.post(
  "/user/:userId/enrollInClass",
  requiresSignin,
  handleErrorNext,
  enrollInClass
);

router.param("myCourseId", myCourseId);
router.param("userId", userById);
router.param("hashId", hashIdUser);
module.exports = router;
