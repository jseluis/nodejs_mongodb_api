const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// const validate = (validator) => {
//   return (req, res, next) => {
//     // const and if could also be inside of post with validateReturn instead
//     // of validator.
//     const { error } = validator(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     next();
//   };
// };

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  // Test case for customerId
  //   if (!req.body.customerId)
  //     return res.status(400).send("customerId no provided.");

  //   // Test case for movieId
  //   if (!req.body.movieId) return res.status(400).send("movieId no provided.");
  // Substituted by the line above

  // Static: Rental.lookup
  // Instance: new User().generateAuthToken()
  // Lookup method
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  //   // Test case for Rental
  //   const rental = await Rental.findOne({
  //     // access property on sub
  //     "customer._id": req.body.customerId,
  //     "movie._id": req.body.movieId,
  //   });
  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.return(); // Instance Method
  await rental.save();

  // Movie update - Update the databse before return the response
  await Movie.updateMany(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  await rental.save();

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
