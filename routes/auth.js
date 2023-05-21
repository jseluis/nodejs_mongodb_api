const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const { valid } = require("joi");
const router = express.Router();

// Endpoint to unhash and check the user and password
router.post("/", async (req, res) => {
  // Return 400 if error is detected
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");
  //  console.log(user.password);

  let isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword)
    return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  //   const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  res.send(token);
});

// Information Expert Principle

function validateUser(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  const validation = schema.validate(req);
  return validation;
}

module.exports = router;

// /api/users
