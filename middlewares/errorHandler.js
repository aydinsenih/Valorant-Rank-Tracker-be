module.exports = function ({ statusCode = 501, errorMessage }, req, res, next) {
  console.log("error handler");
  res.status(statusCode).json({ errorMessage });
};
