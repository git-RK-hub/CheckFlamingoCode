const express = require("express");
const router = express.Router();
const { courseId } = require("../controllers/course");
const { sectionId } = require("../controllers/section");
const {
  upload2,
  parseFields,
  updateParsefields,
} = require("../controllers/subSection");
const {
  create,
  subSectionId,
  list,
  update,
  remove,
  uploadImage,
  createWithFile,
  updateWithFile,
  read,
  temp2,
} = require("../controllers/subSection");
const { subSectionValidator } = require("../validator/index");
const { handleErrorNext, requiresSignin } = require("../controllers/auth");
router.post(
  "/course/:courseId/section/:sectionId/subSection/create",
  requiresSignin,
  handleErrorNext,
  subSectionValidator,
  create
);
router.post(
  "/course/:courseId/section/:sectionId/subSection/createWithFile",
  requiresSignin,
  handleErrorNext,
  parseFields,
  create
);
router.put(
  "/course/:courseId/section/:sectionId/subSection/:subSectionId/updateWithFile",
  requiresSignin,
  handleErrorNext,
  updateParsefields,
  update
);
router.get(
  "/course/:courseId/section/:sectionId/subSection/list",
  requiresSignin,
  handleErrorNext,
  list
);
router.get(
  "/course/:courseId/section/:sectionId/subSection/read/:subSectionId",
  requiresSignin,
  handleErrorNext,
  read
);
router.put(
  "/course/:courseId/section/:sectionId/subSection/:subSectionId/update",
  requiresSignin,
  handleErrorNext,
  subSectionValidator,
  update
);
router.delete(
  "/course/:courseId/section/:sectionId/subSection/:subSectionId/remove",
  requiresSignin,
  handleErrorNext,
  remove
);
router.post("/uploadImage", requiresSignin, handleErrorNext, uploadImage);

router.param("courseId", courseId);
router.param("sectionId", sectionId);
router.param("subSectionId", subSectionId);

module.exports = router;
