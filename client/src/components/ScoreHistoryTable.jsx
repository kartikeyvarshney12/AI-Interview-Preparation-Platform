const ScoreHistoryTable = ({ interviews }) => {
  const completedInterviews = interviews
    .filter(
      (interview) =>
        interview.status === "completed"
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  const getScoreClass = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    return "score-low";
  };

  if (completedInterviews.length === 0) {
    return (
      <div className="empty-table">
        No completed interviews yet.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="history-table">
        <thead>
          <tr>
            <th>Interview ID</th>
            <th>Score</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {completedInterviews.map(
            (interview) => (
              <tr key={interview._id}>
                <td>
                  {interview._id.slice(-8)}
                </td>

                <td>
                  <span
                    className={`score-badge ${getScoreClass(
                      interview.score || 0
                    )}`}
                  >
                    {interview.score || 0}%
                  </span>
                </td>

                <td>
                  <span className="status-badge status-completed">
                    Completed
                  </span>
                </td>

                <td>
                  {new Date(
                    interview.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreHistoryTable;