const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    questions: [questionSchema],

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      suggestions: {
        type: [String],
        default: [],
      },
      overallFeedback: {
        type: String,
        default: "",
      },
    },

    // =========================
    // DAY 13 REATTEMPT SYSTEM
    // =========================

    isReattempt: {
      type: Boolean,
      default: false,
    },

    parentInterview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: null,
    },

    attemptNumber: {
      type: Number,
      default: 1,
    },

    previousScore: {
      type: Number,
      default: null,
    },

    improvement: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);