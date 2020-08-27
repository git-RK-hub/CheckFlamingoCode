const express = require("express");
const router = express.Router();
const { list, read, blogId } = require("../controllers/blog");
router.get("/blogs", list);
router.get("/blog/:blogId", read);
router.param("blogId", blogId);
module.exports = router;
