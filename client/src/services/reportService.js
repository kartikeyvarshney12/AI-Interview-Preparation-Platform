import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/reports`;

const downloadInterviewReport = async (interviewId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/interview/${interviewId}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `interview-report-${interviewId}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Download Report Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to download report",
    };
  }
};

const reportService = {
  downloadInterviewReport,
};

export default reportService;