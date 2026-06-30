import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/resume`;

const handleApiError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  throw error;
};

const uploadResume = async (file) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("resume", file);

    const response = await axios.post(
      `${API_URL}/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const resumeService = {
  uploadResume,
};

export default resumeService;