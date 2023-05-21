const validateObjectId = require("../middleware/validateObjectId");
const asyncMiddleware = require("../middleware/async");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Genre, validateGenre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Moved to async.js inside middleware
// function asyncMiddleware(handler) {
//   return async (req, res, next) => {
//     try {
//       await handler(req, res);
//     } catch (ex) {
//       next(ex);
//     }
//   };
// }

// router.get("/", async (req, res, next) => {
// router.get(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     // try {
//     const genres = await Genre.find().sort("name");
//     res.send(genres);
//     // } catch (ex) {
//     //   // run next from index.js which runs after all app.use
//     //   // The function at index.js will pass err
//     //   next(ex);
//     // }
//   })
// );

router.get("/", async (req, res) => {
  //throw new Error("Could not get the genres.");
  // try {
  const genres = await Genre.find().sort("name");
  res.send(genres);
  // } catch (ex) {
  //   // run next from index.js which runs after all app.use
  //   // The function at index.js will pass err
  //   next(ex);
  // }
});

// We can use const asyncMiddleware = require("../middleware/async");
// and asyncMiddleware() inside post (endpoint) or simply not do it,
// and use the package express-async-errors in the index.js and
// eliminate the asyncMiddleware from all the endpoints. The middleware
// error handling will still be shown. Handling async middlewares.
// auth to be executed before handler
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
  })
);

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  // if (!mongoose.Types.ObjectId.isValid(req.params.id))
  // return res.status(404).send("Invalid ID.");
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
