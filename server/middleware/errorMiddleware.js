const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode =
    res.statusCode === 200 ? 500 : res.statusCode;

  let message =
    err.message || "Internal Server Error";

  // Invalid Mongo ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // Mongo Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message =
      "Duplicate data already exists.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  errorHandler,
};