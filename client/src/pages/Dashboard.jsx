import { useEffect, useState } from "react";
import interviewService from "../services/interviewService";
import StatisticsCards from "../components/StatisticsCards";
import RecentInterviews from "../components/RecentInterviews";
import PerformanceChart from "../components/PerformanceChart";
import ScoreHistoryTable from "../components/ScoreHistoryTable";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [historyData, analyticsData] =
        await Promise.all([
          interviewService.getInterviewHistory(),
          interviewService.getInterviewAnalytics(),
        ]);

      setInterviews(historyData.interviews || []);

      setAnalytics(
        analyticsData.analytics || {}
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalInterviews =
    analytics.totalInterviews || 0;

  const completedInterviews =
    analytics.completedInterviews || 0;

  const averageScore =
    analytics.averageScore || 0;

  const highestScore =
    analytics.highestScore || 0;

  if (loading) {
    return (
      <LoadingSpinner text="Loading Dashboard..." />
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Dashboard
        </h1>

        <p className="dashboard-subtitle">
          Track your interview performance,
          progress and AI evaluation insights.
        </p>
      </div>

      <StatisticsCards
        totalInterviews={totalInterviews}
        completedInterviews={
          completedInterviews
        }
        averageScore={averageScore}
        highestScore={highestScore}
        totalReattempts={
          analytics.totalReattempts || 0
        }
        averageImprovement={
          analytics.averageImprovement || 0
        }
        bestImprovement={
          analytics.bestImprovement || 0
        }
      />

      <div className="quick-actions">
        <button
          className="action-btn"
          onClick={() =>
            (window.location.href =
              "/upload-resume")
          }
        >
          Upload Resume
        </button>

        <button
          className="action-btn"
          onClick={() =>
            (window.location.href =
              "/mock-interview")
          }
        >
          Start Interview
        </button>

        <button
          className="action-btn"
          onClick={() =>
            (window.location.href =
              "/history")
          }
        >
          View History
        </button>
      </div>

      <div className="dashboard-section">
        <div className="section-card">
          <h3 className="section-title">
            Performance Trend
          </h3>

          <PerformanceChart
            interviews={interviews}
          />
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-card">
          <h3 className="section-title">
            Score History
          </h3>

          <ScoreHistoryTable
            interviews={interviews}
          />
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-card">
          <h3 className="section-title">
            Recent Interviews
          </h3>

          <RecentInterviews
            interviews={[...interviews]
              .sort(
                (a, b) =>
                  new Date(b.createdAt) -
                  new Date(a.createdAt)
              )
              .slice(0, 5)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;