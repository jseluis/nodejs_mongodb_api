module.exports = (validator) => {
  return (req, res, next) => {
    // const and if could also be inside of post with validateReturn instead
    // of validator.
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};
