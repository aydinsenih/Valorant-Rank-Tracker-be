module.exports = function ({ statusCode = 501, errorMessage }, req, res, next) {
  console.log({ errorMessage });
  res.status(statusCode).json({ errorMessage });
};
