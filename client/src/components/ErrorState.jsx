const ErrorState = ({
  message = "Something went wrong"
}) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        ⚠️
      </div>

      <h3>Error</h3>

      <p>{message}</p>
    </div>
  );
};

export default ErrorState;