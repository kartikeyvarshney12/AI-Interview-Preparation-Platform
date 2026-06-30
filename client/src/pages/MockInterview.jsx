import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import interviewService from "../services/interviewService";
import InterviewQuestionCard from "../components/InterviewQuestionCard";
import InterviewProgress from "../components/InterviewProgress";
import InterviewActions from "../components/InterviewActions";
import InterviewSetup from "../components/InterviewSetup";
import Navbar from "../components/Navbar";

const MockInterview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const startInterviewHandler = async (
    interviewSettings
  ) => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await interviewService.startInterview(
          interviewSettings
        );

      setInterviewId(data.interviewId);
      setQuestions(data.questions);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setCompleted(false);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to start interview"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadInterview = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await interviewService.getInterviewById(id);

      const interview = data.interview;

      setInterviewId(interview._id);
      setQuestions(interview.questions || []);
      console.log("Interview:", interview);
      console.log("Questions:", interview.questions);

      const existingAnswers = {};

      interview.questions.forEach(
        (question, index) => {
          existingAnswers[index] =
            question.answer || "";
        }
      );

      setAnswers(existingAnswers);
      setCurrentQuestionIndex(0);
      setCompleted(
        interview.status === "completed"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load interview"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadInterview();
    }
  }, [id]);

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const saveAnswerHandler = async () => {
    try {
      setLoading(true);

      await interviewService.saveAnswer(
        interviewId,
        currentQuestionIndex,
        answers[currentQuestionIndex] || ""
      );

      setMessage("Answer saved successfully");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save answer"
      );
    } finally {
      setLoading(false);
    }
  };

  const nextQuestionHandler = () => {
    if (
      currentQuestionIndex <
      questions.length - 1
    ) {
      setCurrentQuestionIndex(
        (prev) => prev + 1
      );

      setMessage("");
    }
  };

  const previousQuestionHandler = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (prev) => prev - 1
      );

      setMessage("");
    }
  };

  const completeInterviewHandler = async () => {
    try {
      setLoading(true);

      await interviewService.completeInterview(
        interviewId
      );

      navigate(
        `/interview-result/${interviewId}`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to complete interview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="interview-page">
        <div className="interview-header">
          <h1 className="interview-title">
            AI Mock Interview
          </h1>

          <p className="interview-subtitle">
            Practice personalized interview
            questions generated from your
            resume.
          </p>
        </div>

        {!id && !interviewId && (
          <InterviewSetup
            onStart={startInterviewHandler}
            loading={loading}
          />
        )}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {questions.length > 0 &&
          !completed && (
            <>
              <InterviewProgress
                currentQuestion={
                  currentQuestionIndex + 1
                }
                totalQuestions={
                  questions.length
                }
              />

              <InterviewQuestionCard
                question={
                  JSON.stringify(
                    questions[currentQuestionIndex],
                    null,
                    2
                  )
                }
                answer={
                  answers[
                    currentQuestionIndex
                  ] || ""
                }
                onAnswerChange={
                  handleAnswerChange
                }
              />

              <InterviewActions
                currentQuestionIndex={
                  currentQuestionIndex
                }
                totalQuestions={
                  questions.length
                }
                onPrevious={
                  previousQuestionHandler
                }
                onSave={
                  saveAnswerHandler
                }
                onNext={
                  nextQuestionHandler
                }
                onComplete={
                  completeInterviewHandler
                }
              />
            </>
          )}
      </div>
    </>
  );
};

export default MockInterview;