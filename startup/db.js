const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(config.get("db")) // test database
    .then(() => winston.info(`Connected to ${db}...`));
  //.then(() => console.log("Connected to MongoDB..."));
  // .connect("mongodb://127.0.0.1:27017/vidly")
  // .catch((err) => console.error("Could not connect to MongoDB...", err));
};
