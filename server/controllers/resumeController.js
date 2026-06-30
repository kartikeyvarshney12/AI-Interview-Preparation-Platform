const fs = require("fs");
const Resume = require("../models/Resume");
const extractTextFromPDF = require("../utils/pdfExtractor");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const extractedText =
      await extractTextFromPDF(req.file.path);

    const existingResume =
      await Resume.findOne({
        user: req.user.id,
      });

    if (existingResume) {
      // Delete old PDF from uploads folder
      if (
        existingResume.filePath &&
        fs.existsSync(existingResume.filePath)
      ) {
        fs.unlinkSync(existingResume.filePath);
      }

      // Update existing resume
      existingResume.fileName =
        req.file.originalname;

      existingResume.filePath =
        req.file.path;

      existingResume.extractedText =
        extractedText;

      await existingResume.save();

      return res.status(200).json({
        success: true,
        message:
          "Resume replaced successfully.",
        resumeId: existingResume._id,
      });
    }

    // First upload
    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      extractedText,
    });

    res.status(201).json({
      success: true,
      message:
        "Resume uploaded successfully.",
      resumeId: resume._id,
    });
  } catch (error) {
    console.error(
      "Resume Upload Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  uploadResume
};