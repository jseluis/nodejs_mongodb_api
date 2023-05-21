const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

let server;

describe("auth middleware", () => {
  //
  beforeEach(() => {
    //
    server = require("../../index");
  });
  afterEach(async () => {
    //
    await Genre.deleteMany({});
    await server.close();
  });

  let token;

  const exec = async () => {
    //
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
    // ... something that could be executed, and then return.
  };

  beforeEach(() => {
    //
    token = new User().generateAuthToken();
  });

  it("return 401 if no token is provided", async () => {
    //
    token = ""; // null = 400, sent as string in the http request
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("return 400 token is invalid", async () => {
    //
    token = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("return 200 token is valid", async () => {
    //

    const res = await exec();
    expect(res.status).toBe(200);
  });
});
