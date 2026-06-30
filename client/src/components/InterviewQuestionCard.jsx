const InterviewQuestionCard = ({
  question,
  answer,
  onAnswerChange,
}) => {
  return (
    <div>
      <div className="question-card">
        <div className="question-number">
          Interview Question
        </div>

        <div className="question-text">
          {question}
        </div>
      </div>

      <textarea
        className="answer-textarea"
        value={answer}
        onChange={(e) =>
          onAnswerChange(e.target.value)
        }
        placeholder="Write your answer here in detail..."
      />
    </div>
  );
};

export default InterviewQuestionCard;