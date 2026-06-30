import axios from "axios";

const API_URL = "http://localhost:5000/api/interviews";

const handleApiError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  throw error;
};

const getToken = () => {
  return localStorage.getItem("token");
};

const getConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
};

// Start Interview
const startInterview = async (data = {}) => {
  try {
    const response = await axios.post(
      `${API_URL}/start`,
      data,
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get Interview By ID
const getInterviewById = async (interviewId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${interviewId}`,
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Save Answer
const saveAnswer = async (
  interviewId,
  questionIndex,
  answer
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${interviewId}/answer`,
      {
        questionIndex,
        answer,
      },
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Complete Interview
const completeInterview = async (interviewId) => {
  try {
    const response = await axios.put(
      `${API_URL}/${interviewId}/complete`,
      {},
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Interview History
const getInterviewHistory = async (
  search = "",
  category = "All",
  difficulty = "All",
  page = 1
) => {
  try {
    const response = await axios.get(
      `${API_URL}/history`,
      {
        ...getConfig(),
        params: {
          search,
          category,
          difficulty,
          page,
          limit: 10,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Interview Analytics
const getInterviewAnalytics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics`,
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Reattempt Interview
const reattemptInterview = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/${id}/reattempt`,
      {},
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get Interview Attempts
const getInterviewAttempts = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/${id}/attempts`,
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Delete Interview
const deleteInterview = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      getConfig()
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const interviewService = {
  startInterview,
  getInterviewById,
  saveAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewAnalytics,
  reattemptInterview,
  getInterviewAttempts,
  deleteInterview,
};

export default interviewService;