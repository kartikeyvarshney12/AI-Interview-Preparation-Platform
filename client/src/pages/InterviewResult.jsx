import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import interviewService from "../services/interviewService";
import reportService from "../services/reportService";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const data =
        await interviewService.getInterviewById(id);

      setInterview(data.interview);
      const attemptsData =
        await interviewService.getInterviewAttempts(
          id
        );

      setAttempts(
        attemptsData.attempts || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load result"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <LoadingSpinner
        text="Loading Result..."
        />
    );
  }

  if (error) {
    return (
        <ErrorState
        message={error}
        />
    );
  }

  const getPerformanceLevel = (score) => {
    if (score >= 85)
      return {
        label: "Excellent",
        className: "performance-excellent",
      };

    if (score >= 70)
      return {
        label: "Good",
        className: "performance-good",
      };

    if (score >= 50)
      return {
        label: "Average",
        className: "performance-average",
      };

    return {
      label: "Needs Improvement",
      className: "performance-poor",
    };
  };

  const performance = getPerformanceLevel(
    interview?.score || 0
  );

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);

      const result =
        await reportService.downloadInterviewReport(
          interview._id
        );

      if (!result.success) {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);

      alert("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const handleReattempt = async () => {
    try {
      const data = await interviewService.reattemptInterview(
        interview._id
      );

      navigate(`/mock-interview/${data.interviewId}`);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create reattempt interview."
      );
    }
  };

  console.log("Attempts:", attempts);
  
  return (
    <>
      <Navbar />

      <div className="result-page">

        <div className="result-header">
          <h1 className="result-title">
            Interview Evaluation Report
          </h1>

          <p className="result-subtitle">
            AI generated analysis of your
            interview performance.
          </p>
        </div>

        <div className="result-meta">

          <span className="category-badge">
            {interview.category || "Technical"}
          </span>

          <span className="difficulty-badge">
            {interview.difficulty || "Medium"}
          </span>

          <span
            className={`performance-badge ${performance.className}`}
          >
            {performance.label}
          </span>

        </div>

        <div className="result-date">
          {new Date(
            interview.createdAt
          ).toLocaleString()}
        </div>

        <div className="score-section">
          <div className="score-circle">

            <div className="score-number">
              {interview.score}
            </div>

            <div className="score-label">
              Score / 100
            </div>

          </div>
        </div>

        {interview.attemptNumber > 1 && (
          <div className="comparison-card">

            <h3>📊 Performance Comparison</h3>

            <div className="comparison-grid">

              <div className="comparison-item">
                <span>Previous Score</span>
                <strong>
                  {interview.previousScore}
                </strong>
              </div>

              <div className="comparison-item">
                <span>Current Score</span>
                <strong>
                  {interview.score}
                </strong>
              </div>

              <div className="comparison-item">
                <span>Improvement</span>

                <strong
                  className={
                    interview.improvement >= 0
                      ? "positive-score"
                      : "negative-score"
                  }
                >
                  {interview.improvement >= 0
                    ? "+"
                    : ""}
                  {interview.improvement}
                </strong>
              </div>

              <div className="comparison-item">
                <span>Attempt</span>
                <strong>
                  #{interview.attemptNumber}
                </strong>
              </div>

            </div>

          </div>
        )}

        {attempts.filter((a) => a.status === "completed").length > 1 && (
          <div className="timeline-card">
            <h3>📜 Interview Timeline</h3>

            <div className="timeline-list">
              {attempts
                .filter((attempt) => attempt.status === "completed")
                .map((attempt) => (
                  <div
                    key={attempt._id}
                    className="timeline-item"
                  >
                    <div className="timeline-left">
                      <strong>
                        Attempt #{attempt.attemptNumber}
                      </strong>

                      <p>
                        {new Date(
                          attempt.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="timeline-right">
                      <div className="timeline-score">
                        {attempt.score}
                      </div>

                      {attempt.attemptNumber > 1 && (
                        <span
                          className={
                            attempt.improvement >= 0
                              ? "positive-score"
                              : "negative-score"
                          }
                        >
                          {attempt.improvement >= 0
                            ? "+"
                            : ""}
                          {attempt.improvement}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="feedback-grid">

          <div className="feedback-card">
            <h3>💪 Strengths</h3>

            <ul>
              {interview.feedback?.strengths?.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="feedback-card">
            <h3>⚠️ Weaknesses</h3>

            <ul>
              {interview.feedback?.weaknesses?.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="feedback-card">
            <h3>🚀 Suggestions</h3>

            <ul>
              {interview.feedback?.suggestions?.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

        </div>

        <div className="summary-card">

          <h3>
            Overall Feedback
          </h3>

          <p>
            {
              interview.feedback
                ?.overallFeedback
            }
          </p>

          <button
            className="export-report-btn"
            onClick={handleDownloadReport}
            disabled={downloading}
          >
            {
              downloading
                ? "Generating PDF..."
                : "📄 Export PDF Report"
            }
          </button>

          <button
            className="reattempt-btn"
            onClick={handleReattempt}
          >
            🔄 Reattempt Interview
          </button>

        </div>

      </div>
    </>
  );
};

export default InterviewResult;