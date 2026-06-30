const Interview = require("../models/Interview");
const generateInterviewReport = require("../utils/pdfGenerator");

const exportInterviewReport = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // Security Check
    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const pdfBuffer = await generateInterviewReport(interview);

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=interview-report-${id}.pdf`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Export Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });
  }
};

module.exports = {
  exportInterviewReport,
};