import { useState } from "react";

const InterviewSetup = ({ onStart, loading }) => {
  const [category, setCategory] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");

  const handleSubmit = () => {
    onStart({
      category,
      difficulty,
    });
  };

  return (
    <div className="interview-setup-card">
      <h2>Select Interview Settings</h2>

      <div className="setup-group">
        <label>Interview Category</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Technical">Technical</option>
          <option value="HR">HR</option>
          <option value="Behavioral">Behavioral</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>

      <div className="setup-group">
        <label>Difficulty Level</label>

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <button
        className="start-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? "Generating Questions..."
          : "Start Interview"}
      </button>
    </div>
  );
};

export default InterviewSetup;