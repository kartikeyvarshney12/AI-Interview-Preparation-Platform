import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import interviewService from "../services/interviewService";
import Navbar from "../components/Navbar";

const InterviewHistory = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedInterview, setSelectedInterview] =
    useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadHistory(debouncedSearch);
  }, [debouncedSearch, category, difficulty, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, difficulty]);

  const loadHistory = async (searchText = "") => {
    try {
      setLoading(true);
      setError("");

      const data =
        await interviewService.getInterviewHistory(
          searchText,
          category,
          difficulty,
          page
        );

      setTotalPages(data.totalPages || 1);
      setInterviews(data.interviews || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load interview history."
      );
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedInterview(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedInterview(null);
    setShowDeleteModal(false);
  };

  const handleDeleteInterview = async () => {
    try {
      await interviewService.deleteInterview(
        selectedInterview
      );

      closeDeleteModal();

      loadHistory(debouncedSearch);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete interview."
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="history-page">
          <h2>Loading History...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="history-page">
        <div className="history-header">
          <h1>Interview History</h1>

          <p>
            Track all your mock interviews and
            performance.
          </p>

          <div className="history-filters">
            <input
              type="text"
              placeholder="Search interviews..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="search-input"
            />

            <select
              className="category-filter"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="All">
                All Categories
              </option>
              <option value="Technical">
                Technical
              </option>
              <option value="HR">HR</option>
              <option value="Behavioral">
                Behavioral
              </option>
              <option value="Mixed">
                Mixed
              </option>
            </select>

            <select
              className="difficulty-filter"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
            >
              <option value="All">
                All Difficulties
              </option>
              <option value="Easy">Easy</option>
              <option value="Medium">
                Medium
              </option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {interviews.length === 0 ? (
          <div className="history-empty">
            {search
              ? `No interviews found for "${search}".`
              : "No interviews found."}
          </div>
        ) : (
          <>
            <div className="history-grid">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="history-card"
                >
                  <div className="history-top">
                    <span
                      className={`status-badge ${
                        interview.status ===
                        "completed"
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      {interview.status}
                    </span>

                    <div className="badge-group">
                      <span className="category-badge">
                        {interview.category ||
                          "Technical"}
                      </span>

                      <span className="difficulty-badge">
                        {interview.difficulty ||
                          "Medium"}
                      </span>
                    </div>
                  </div>

                  <h3>
                    Score:{" "}
                    {interview.score ?? 0}
                  </h3>

                  <p>
                    Questions:{" "}
                    {interview.questions
                      ?.length || 0}
                  </p>

                  <p>
                    {new Date(
                      interview.createdAt
                    ).toLocaleString()}
                  </p>

                  <small>
                    ID: {interview._id}
                  </small>

                  {interview.status ===
                    "completed" && (
                    <div className="history-actions">
                      <button
                        className="view-result-btn"
                        onClick={() =>
                          navigate(
                            `/interview-result/${interview._id}`
                          )
                        }
                      >
                        View Result
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          openDeleteModal(
                            interview._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Delete Interview?</h2>

            <p>
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                onClick={closeDeleteModal}
              >
                Cancel
              </button>

              <button
                className="delete-btn"
                onClick={handleDeleteInterview}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewHistory;