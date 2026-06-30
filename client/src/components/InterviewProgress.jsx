const InterviewProgress = ({
  currentQuestion,
  totalQuestions,
}) => {
  const percentage =
    (currentQuestion / totalQuestions) * 100;

  return (
    <div className="progress-container">

      <h3>
        Question {currentQuestion} of{" "}
        {totalQuestions}
      </h3>

      <p>
        {Math.round(percentage)}% Completed
      </p>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
};

export default InterviewProgress;