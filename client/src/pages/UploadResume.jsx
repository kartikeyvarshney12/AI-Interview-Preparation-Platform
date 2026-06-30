import { useState } from "react";
import resumeService from "../services/resumeService";
import Navbar from "../components/Navbar";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data =
        await resumeService.uploadResume(file);

      setMessage(
        data.message ||
        "Resume uploaded successfully."
      );

      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Resume upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="upload-page">

        <div className="upload-card">

          <div className="upload-header">
            <h1 className="upload-title">
              Upload / Replace Resume
            </h1>

            <p className="upload-subtitle">
              Upload your latest resume and let AI generate
              personalized interview questions.
            </p>
          </div>

          <div className="file-upload-box">

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />

            {file && (
              <div className="file-name">
                📄 {file.name}
              </div>
            )}

          </div>

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload / Replace Resume"}
          </button>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default UploadResume;