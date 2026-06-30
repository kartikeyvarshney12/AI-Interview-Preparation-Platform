const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const openai = require("../config/openai");
const evaluateInterview = require("../utils/evaluateInterview");

/*
|--------------------------------------------------------------------------
| Start Interview
|--------------------------------------------------------------------------
*/

const startInterview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      category = "Technical",
      difficulty = "Medium",
    } = req.body;

    const validCategories = [
      "Technical",
      "HR",
      "Behavioral",
      "Mixed",
    ];

    const validDifficulties = [
      "Easy",
      "Medium",
      "Hard",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview category",
      });
    }

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview difficulty",
      });
    }

    const resume = await Resume.findOne({
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const prompt = `
You are an expert interviewer.

Generate exactly 10 interview questions.

Interview Category:
${category}

Difficulty Level:
${difficulty}

Candidate Resume:
${resume.extractedText}

Instructions:

- If category is Technical:
  Ask technical questions related to skills, projects, backend, frontend, databases, DSA, APIs, authentication, and software engineering concepts.

- If category is HR:
  Ask HR and personality questions about teamwork, leadership, strengths, weaknesses, communication, career goals, and conflict resolution.

- If category is Behavioral:
  Ask scenario-based STAR format questions.

- If category is Mixed:
  Include a balanced mix of Technical, HR, and Behavioral questions.

Difficulty Guidelines:

Easy:
- Basic concepts
- Beginner-level questions

Medium:
- Practical implementation questions
- Project-based questions

Hard:
- Advanced concepts
- Design decisions
- Optimization
- Architecture
- Problem solving

Return ONLY a valid JSON array.

Example:
[
  "Question 1",
  "Question 2"
]
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let questions = [];

    try {
      questions = JSON.parse(
        completion.choices[0].message.content
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "AI response format invalid",
      });
    }

    const interview = await Interview.create({
      user: userId,
      resume: resume._id,
      category,
      difficulty,
      questions: questions.map((q) => ({
        question: q,
        answer: "",
      })),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      category,
      difficulty,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Interview By ID
|--------------------------------------------------------------------------
*/

const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Submit Answer
|--------------------------------------------------------------------------
*/

const submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer } = req.body;

    if (
      questionIndex === undefined ||
      answer === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "questionIndex and answer are required",
      });
    }

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (
      questionIndex < 0 ||
      questionIndex >= interview.questions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    interview.questions[questionIndex].answer = answer;

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Answer saved successfully",
      question: interview.questions[questionIndex],
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Complete Interview
|--------------------------------------------------------------------------
*/

const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const evaluation = await evaluateInterview(
      interview.questions
    );

    interview.score = evaluation.score || 0;

    if (
      interview.previousScore !== null &&
      interview.previousScore !== undefined
    ) {
      interview.improvement =
        interview.score - interview.previousScore;
    } else {
      interview.improvement = 0;
    }

    interview.feedback = {
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      suggestions: evaluation.suggestions || [],
      overallFeedback:
        evaluation.overallFeedback || "",
    };

    interview.status = "completed";

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      score: interview.score,
      feedback: interview.feedback,
    });
  } catch (error) {
    console.error("Complete Interview Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Interview History
|--------------------------------------------------------------------------
*/

const getInterviewHistory = async (req, res, next) => {
  try {
    const {
      search = "",
      category = "",
      difficulty = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      user: req.user.id,
    };

    if (category && category !== "All") {
      query.category = category;
    }

    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    if (search.trim()) {
      query.$or = [
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          difficulty: {
            $regex: search,
            $options: "i",
          },
        },
        {
          status: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "questions.question": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const totalInterviews =
      await Interview.countDocuments(query);

    const interviews = await Interview.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      interviews,
      totalInterviews,
      totalPages: Math.ceil(
        totalInterviews / limit
      ),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

  /*
  |--------------------------------------------------------------------------
  | Interview Analytics
  |--------------------------------------------------------------------------
  */

  const getInterviewAnalytics = async (req, res) => {
    try {
      const userId = req.user.id;

      const totalInterviews = await Interview.countDocuments({
        user: userId,
      });

      const completedInterviews = await Interview.find({
        user: userId,
        status: "completed",
      })
        .select(
          "_id score improvement isReattempt createdAt category difficulty"
        )
        .sort({ createdAt: 1 });

      const averageScore =
        totalInterviews > 0
          ? Math.round(
              completedInterviews.reduce(
                (sum, interview) =>
                  sum + (interview.score || 0),
                0
              ) / totalInterviews
            )
          : 0;

      const highestScore =
        totalInterviews > 0
          ? Math.max(
              ...completedInterviews.map(
                (interview) =>
                  interview.score || 0
              )
            )
          : 0;

      // ==========================
      // Day 13 Reattempt Statistics
      // ==========================

      const reattempts = completedInterviews.filter(
        (interview) => interview.isReattempt
      );

      const totalReattempts = reattempts.length;

      const averageImprovement =
        totalReattempts > 0
          ? Math.round(
              reattempts.reduce(
                (sum, interview) =>
                  sum +
                  (interview.improvement || 0),
                0
              ) / totalReattempts
            )
          : 0;

      const bestImprovement =
        totalReattempts > 0
          ? Math.max(
              ...reattempts.map(
                (interview) =>
                  interview.improvement || 0
              )
            )
          : 0;

      const trendData = completedInterviews.map(
        (interview) => ({
          date: interview.createdAt,
          score: interview.score || 0,
        })
      );

      const history = [...completedInterviews]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .map((interview) => ({
          _id: interview._id,
          score: interview.score || 0,
          category: interview.category,
          difficulty: interview.difficulty,
          createdAt: interview.createdAt,
        }));

      res.status(200).json({
        success: true,
        analytics: {
          totalInterviews,
          completedInterviews: completedInterviews.length,
          averageScore,
          highestScore,

          totalReattempts,
          averageImprovement,
          bestImprovement,

          trendData,
          history,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const reattemptInterview = async (req, res, next) => {
    try {
      const originalInterview = await Interview.findById(req.params.id);

      if (!originalInterview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      if (originalInterview.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      // Find the root interview
      const rootInterview = originalInterview.parentInterview
        ? await Interview.findById(originalInterview.parentInterview)
        : originalInterview;

      // Check if a pending reattempt already exists
      const existingPendingInterview = await Interview.findOne({
        parentInterview: rootInterview._id,
        status: "pending",
      });

      if (existingPendingInterview) {
        return res.status(200).json({
          success: true,
          message: "Pending reattempt already exists.",
          interviewId: existingPendingInterview._id,
          attemptNumber: existingPendingInterview.attemptNumber,
        });
      }

      // Count total attempts
      const totalAttempts = await Interview.countDocuments({
        $or: [
          { _id: rootInterview._id },
          { parentInterview: rootInterview._id },
        ],
      });

      // Create new reattempt
      const newInterview = await Interview.create({
        user: req.user.id,

        resume: originalInterview.resume,

        category: originalInterview.category,

        difficulty: originalInterview.difficulty,

        questions: originalInterview.questions.map((q) => ({
          question: q.question,
          answer: "",
        })),

        status: "pending",

        isReattempt: true,

        parentInterview: rootInterview._id,

        attemptNumber: totalAttempts + 1,

        previousScore: originalInterview.score,

        improvement: 0,
      });

      res.status(201).json({
        success: true,
        message: "Interview reattempt created successfully",
        interviewId: newInterview._id,
        attemptNumber: newInterview.attemptNumber,
      });
    } catch (error) {
      next(error);
    }
  };

  const getInterviewAttempts = async (req, res, next) => {
    try {
      const interview = await Interview.findById(req.params.id);

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      if (interview.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      // Find the original interview in the chain
      const rootInterview = interview.parentInterview
        ? interview.parentInterview
        : interview._id;

      // Fetch original + all reattempts
      const attempts = await Interview.find({
        $or: [
          { _id: rootInterview },
          { parentInterview: rootInterview },
        ],
      })
        .select(
          "attemptNumber score previousScore improvement status createdAt category difficulty"
        )
        .sort({ attemptNumber: 1 });

      res.status(200).json({
        success: true,
        totalAttempts: attempts.length,
        attempts,
      });
    } catch (error) {
      next(error);
    }
  };

  /*
|--------------------------------------------------------------------------
| Delete Interview
|--------------------------------------------------------------------------
*/

const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await Interview.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  getInterviewById,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewAnalytics,
  reattemptInterview,
  getInterviewAttempts,
  deleteInterview,
};