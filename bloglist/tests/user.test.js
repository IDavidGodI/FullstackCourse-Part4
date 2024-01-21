const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const User = require("../models/user")

const api = supertest(app)

const usersUrl = "/users"

beforeAll(async () => {
  await User.deleteMany({})
})

test("User is created correctly", async () => {
  const user = {
    userName: "Antonio15",
    name: "Antonio",
    password: "SuperSecret123"
  }

  const createdUser = await api
    .post(usersUrl)
    .send(user)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  expect(createdUser.body.userName).toBe(user.userName)
  expect(createdUser.body.name).toBe(user.name)

})

test("If password or username are invalid there's a 400 status code", async () => {
  const user = {
    userName: "Ala",
    name: "Antonio",
    // password: "Se"
  }

  const createdUser = await api
    .post(usersUrl)
    .send(user)
    .expect(400)
    .expect("Content-Type", /application\/json/)

})