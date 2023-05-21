const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(err.message, {
    metadata: { message: err.message, name: err.name, stack: err.stack },
  });
  // Log the exception - Single place to handle errors
  res.status(500).send("Something failed.");
};
