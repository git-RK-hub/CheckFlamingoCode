const express = require("express");
const { list, create } = require("../controllers/corporateConnect");
const { requiresSignin, handleErrorNext } = require("../controllers/auth");
const { isAdmin2, isAdmin1 } = require("../controllers/admin");
const router = express.Router();
router.get("/cc/list", list);
router.post("/cc/create", requiresSignin, handleErrorNext, isAdmin1, create); //admin
module.exports = router;
