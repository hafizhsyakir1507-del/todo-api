const express = require("express");
const { getActivityLogs } = require("../controllers/activity-log.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", protect, getActivityLogs);

module.exports = router;
