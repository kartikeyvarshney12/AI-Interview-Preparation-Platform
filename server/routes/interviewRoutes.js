const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");

const {
  startInterview,
  getInterviewById,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewAnalytics,
  reattemptInterview,
  getInterviewAttempts,
  deleteInterview,
} = require("../controllers/interviewController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Interview Routes
|--------------------------------------------------------------------------
*/

// Start Interview
router.post("/start", protect, startInterview);

// Interview History
router.get("/history", protect, getInterviewHistory);

// Analytics
router.get("/analytics", protect, getInterviewAnalytics);

// Reattempt Interview
router.post("/:id/reattempt", protect, validateObjectId, reattemptInterview);

router.get("/:id/attempts", protect, validateObjectId, getInterviewAttempts);

// Get Interview By ID
router.get("/:id", protect, validateObjectId, getInterviewById);

router.delete("/:id", protect, validateObjectId, deleteInterview);

// Submit Answer
router.put("/:id/answer", protect, validateObjectId, submitAnswer);

// Complete Interview
router.put("/:id/complete", protect, validateObjectId, completeInterview);

module.exports = router;