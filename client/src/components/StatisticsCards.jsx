const StatisticsCards = ({
  totalInterviews,
  completedInterviews,
  averageScore,
  highestScore,
  totalReattempts,
  averageImprovement,
  bestImprovement,
}) => {
  return (
    <div className="stats-grid">

      <div className="stat-card primary">
        <div className="stat-header">
          <span className="stat-title">
            Total Interviews
          </span>

          <span className="stat-icon">
            📊
          </span>
        </div>

        <div className="stat-value">
          {totalInterviews}
        </div>

        <div className="stat-description">
          Interviews created on platform
        </div>
      </div>

      <div className="stat-card success">
        <div className="stat-header">
          <span className="stat-title">
            Completed
          </span>

          <span className="stat-icon">
            ✅
          </span>
        </div>

        <div className="stat-value">
          {completedInterviews}
        </div>

        <div className="stat-description">
          Successfully completed interviews
        </div>
      </div>

      <div className="stat-card warning">
        <div className="stat-header">
          <span className="stat-title">
            Average Score
          </span>

          <span className="stat-icon">
            🎯
          </span>
        </div>

        <div className="stat-value">
          {averageScore}
        </div>

        <div className="stat-description">
          Overall interview performance
        </div>
      </div>

      <div className="stat-card danger">
        <div className="stat-header">
          <span className="stat-title">
            Highest Score
          </span>

          <span className="stat-icon">
            🏆
          </span>
        </div>

        <div className="stat-value">
          {highestScore}
        </div>

        <div className="stat-description">
          Best interview result achieved
        </div>
      </div>

      <div className="stat-card primary">
        <div className="stat-header">
          <span className="stat-title">
            Reattempts
          </span>

          <span className="stat-icon">
            🔄
          </span>
        </div>

        <div className="stat-value">
          {totalReattempts}
        </div>

        <div className="stat-description">
          Total interview reattempts
        </div>
      </div>

      <div className="stat-card success">
        <div className="stat-header">
          <span className="stat-title">
            Avg Improvement
          </span>

          <span className="stat-icon">
            📈
          </span>
        </div>

        <div className="stat-value">
          {averageImprovement}
        </div>

        <div className="stat-description">
          Average score improvement
        </div>
      </div>

      <div className="stat-card warning">
        <div className="stat-header">
          <span className="stat-title">
            Best Improvement
          </span>

          <span className="stat-icon">
            🚀
          </span>
        </div>

        <div className="stat-value">
          +{bestImprovement}
        </div>

        <div className="stat-description">
          Highest score improvement
        </div>
      </div>

    </div>
  );
};

export default StatisticsCards;