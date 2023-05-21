const moment = require("moment");
const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  //
  let server;
  let customerId;
  let movieId;
  let movie;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({
        customerId: customerId,
        movieId: movieId,
      });
  };

  beforeEach(async () => {
    //
    server = require("../../index");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      //
      customer: {
        //
        _id: customerId,
        name: 12345,
        phone: 1234567,
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    //
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });
  // First test not null because we have created
  // an instance with customer and movie id's for Rental class
  it("return 401 if not logged in", async () => {
    // Express returns 404 if endpoint is not implemented.
    // const result = await Rental.findById(rental._id);
    // expect(result).not.toBeNull();
    // const res = await request(server).post("/api/returns").send({
    //   customerId: customerId,
    //   movieId: movieId,
    // });
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("return 400 if customerId is not provided", async () => {
    //const token = new User().generateAuthToken();
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 400 if movieId is not provided", async () => {
    // const token = new User().generateAuthToken();
    // const res = await request(server)
    //   .post("/api/returns")
    //   .set("x-auth-token", token)
    //   .send({
    //     customerId: customerId,
    //     // movieId: movieId,
    //   });
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 404 if no rental found for costumer/movie", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 200 if valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("set returnDate if input is valid", async () => {
    const res = await exec();
    // Reload the rental
    const rentalDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000); // 10 sec
    //expect(rentalDb.dateReturned).toBeDefined();
  });

  it("set rentalFee if input is valid", async () => {
    // dateOut (current time) by Mongoose.
    // We need to make sure that the movie has been for 1 day
    rental.dateOut = moment().add(-7, "days").toDate(); // 7 days before
    await rental.save();

    const res = await exec();
    // Reload the rental
    const rentalDb = await Rental.findById(rental._id);

    expect(rentalDb.rentalFee).toBe(14); // 10 sec
  });

  it("set increase the movie stock if input valid", async () => {
    const res = await exec();
    // Reload the rental
    const movieDb = await Movie.findById(movie._id);

    expect(movieDb.numberInStock).toBe(movie.numberInStock + 1); // 10 sec
  });

  it("set increase the rental if input valid", async () => {
    const res = await exec();
    const rentalDb = await Rental.findById(rental._id);
    // Substitute by the expect below
    // expect(res.body).toHaveProperty("dateOut");
    // expect(res.body).toHaveProperty("dateReturned");
    // expect(res.body).toHaveProperty("rentalFee");
    // expect(res.body).toHaveProperty("customer");
    // expect(res.body).toHaveProperty("movie");

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
