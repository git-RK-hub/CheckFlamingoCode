const express = require("express");
const router = express.Router();
const {
  createClass,
  createInstructor,
  createAdmin,
  adminSignup,
  adminById,
  isAdmin3,
  checkAdminbyEmail,
  isAdmin1,
  hashIdAdmin,
  isAdmin2,
  createBlogByContent,
  createBlogByLink,
  checkLink,
  parseCSV,
  checkAllUserEmails,
  checkAllInstructorEmails,
  checkAllAdminEmails,
  createMultiUsers,
  checkForDups,
  parseBlogFields,
  adminRead,
  adminCoursePermissions,
  adminBlogPermissions,
  adminAcceptBlog,
  changeCourseStatus,
  changeBlogStatus,
  changeApprovedCourseStatus,
  createAdmin3,
  setCoursePrice,
  universities,
  adminCourseApprovalPermissions,
  universitiesDepts
} = require("../controllers/admin");
const {
  checkInstructorbyEmail,
  checkInstructor,
  findClass
} = require("../controllers/instructor");
const {
  requiresSignin,
  handleErrorNext,
  checkUserbyEmail,
  checkUser
} = require("../controllers/auth");
const { verifyAdmin } = require("../helpers/emailHandler");
const {
  userSignupValidator,
  emailValidator,
  linkValidator
} = require("../validator/index");
const { courseId } = require("../controllers/course");
const { blogId } = require("../controllers/blog");
router.get(
  "/admin/:adminId",
  requiresSignin,
  handleErrorNext,
  isAdmin3,
  adminRead
);
router.post(
  "/admin/:adminId/createInstructor",
  requiresSignin,
  handleErrorNext,
  isAdmin2,
  emailValidator,
  checkAdminbyEmail,
  checkUserbyEmail,
  createInstructor
);

// Admin will create class
router.post(
  "/admin/:adminId/createClass",
  requiresSignin,
  handleErrorNext,
  // isAdmin2,
  createClass
);

router.post(
  "/admin/:adminId/createBlogByContent",
  requiresSignin,
  handleErrorNext,
  isAdmin2,
  parseBlogFields,
  createBlogByContent,
  adminAcceptBlog
);
router.post(
  "/admin/:adminId/createBlogByLink",
  requiresSignin,
  handleErrorNext,
  isAdmin2,
  linkValidator,
  checkLink,
  parseBlogFields,
  createBlogByLink,
  adminAcceptBlog
);

router.post(
  "/admin/:adminId/createAdmin",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  emailValidator,
  checkUserbyEmail,
  checkInstructorbyEmail,
  createAdmin
);
router.post(
  "/admin/:adminId/createAdmin3",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  emailValidator,
  checkUserbyEmail,
  checkInstructorbyEmail,
  createAdmin3
);

router.post(
  "/admin/:adminId/createMultipleUsers",
  requiresSignin,
  handleErrorNext,
  isAdmin3,
  parseCSV,
  checkForDups,
  checkAllUserEmails,
  checkAllAdminEmails,
  checkAllInstructorEmails,
  createMultiUsers
);
router.post(
  "/admin/signup/:hashId",
  userSignupValidator,
  checkInstructor,
  checkUser,
  adminSignup
);

router.put(
  "//admin/:adminId/adminapproveBlog/:blogId",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  changeBlogStatus
);
router.put(
  "/admin/:adminId/adminApprovecourse/:courseId",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  changeCourseStatus
);
router.put(
  "/admin/:adminId/adminApprovedCourseChangeStatus/:courseId",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  changeApprovedCourseStatus
);
router.put(
  "/admin/:adminId/setPrice/:courseId",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  setCoursePrice
);
router.get("/adminUniversities", requiresSignin, handleErrorNext, universities);
router.get(
  "/adminUniversitiesDepts",
  requiresSignin,
  handleErrorNext,
  universitiesDepts
);
router.get("/verifyAdmin/:hashId", verifyAdmin);
router.get(
  "/admin/:adminId/adminCoursePermissions",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  adminCoursePermissions
);
router.get(
  "/admin/:adminId/adminCourseApprovalPermissions",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  adminCourseApprovalPermissions
);
router.get(
  "/admin/:adminId/adminBlogPermissions",
  requiresSignin,
  handleErrorNext,
  isAdmin1,
  adminBlogPermissions
);

router.param("blogId", blogId);
router.param("courseId", courseId);
router.param("adminId", adminById);
router.param("hashId", hashIdAdmin);
module.exports = router;
