const InterviewActions = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onSave,
  onNext,
  onComplete,
}) => {
  return (
    <div className="action-buttons">

      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        Previous
      </button>

      <button onClick={onSave}>
        Save Answer
      </button>

      {currentQuestionIndex <
      totalQuestions - 1 ? (
        <button onClick={onNext}>
          Next
        </button>
      ) : (
        <button onClick={onComplete}>
          Complete Interview
        </button>
      )}

    </div>
  );
};

export default InterviewActions;