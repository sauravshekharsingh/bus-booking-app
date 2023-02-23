export const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    // stack: err.stack,
  });
};
