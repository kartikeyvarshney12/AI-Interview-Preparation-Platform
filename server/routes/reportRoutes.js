const express = require("express");
const router = express.Router();

const { exportInterviewReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.get(
  "/interview/:id",
  protect,
  exportInterviewReport
);

module.exports = router;