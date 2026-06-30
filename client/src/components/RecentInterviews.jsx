import { useNavigate } from "react-router-dom";

const RecentInterviews = ({ interviews }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Recent Interviews</h2>

      {interviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Interview ID</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id}>
                  <td>
                    {interview._id.slice(-8)}
                  </td>

                  <td>
                    <span className="category-badge">
                      {interview.category ||
                        "Technical"}
                    </span>
                  </td>

                  <td>
                    <span className="difficulty-badge">
                      {interview.difficulty ||
                        "Medium"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        interview.status === "completed"
                          ? "status-completed"
                          : "status-pending"
                      }`}
                    >
                      {interview.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      interview.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {interview.status ===
                    "completed" ? (
                      <button
                        className="action-btn"
                        onClick={() =>
                          navigate(
                            `/interview-result/${interview._id}`
                          )
                        }
                      >
                        View Result
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentInterviews;