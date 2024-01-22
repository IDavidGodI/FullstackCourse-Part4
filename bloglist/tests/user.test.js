const mongoose = require("mongoose");
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const User = require("../models/user")
const { head } = require("lodash")

const api = supertest(app)

const usersUrl = "/users"
const blogsUrl = "/api/blogs"
const loginUrl = "/api/login"

beforeAll(async () => {
  await helper.clearBlogs()
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

test("User is created correctly", async () => {
  const user = {
    userName: "toRepeat",
    name: "R",
    password: "SuperSecret123"
  }

  await api
    .post(usersUrl)
    .send(user)
    .expect(201)

  const { body: error } = await api
    .post(usersUrl)
    .send(user)
    .expect(400)

  console.log("Error", error.body)

})

test("If password or username are invalid there's a 400 status code", async () => {
//   const user = {
//     userName: "Ala1234",
//     name: "Antonio",
//     password: "Se"
//   }

  //   await api
  //     .post(usersUrl)
  //     .send(user)
  //     .expect(400)
  //     .expect("Content-Type", /application\/json/)

  // })

  // test("Adding a blog with an user id", async () => {

  //   const users = await helper.usersInDb()

  //   const testUser = head(users)

  //   const newBlog = {
  //     title: "Total invent",
  //     author: "me",
  //     url: "invent.com",
  //     likes: 10,
  //     userId: testUser.id
  //   }

  //   const createdBlog = await api
  //     .post(blogsUrl)
  //     .send(newBlog)
  //     .expect(201)

  //   console.log(createdBlog.body)

  //   const blog = await api
  //     .get(`${blogsUrl}/${createdBlog.body.id}`)

  //   expect(blog.body.user.userName).toBe(testUser.userName)

  // })


  // test.only("The server send a token when login is correct", async () => {
  //   const user = {
  //     userName: "Ala1234",
  //     name: "Antonio",
  //     password: "Password"
  //   }

  //   await api
  //     .post(usersUrl)
  //     .send(user)

  //   const loginInfo = {
  //     userName: "Ala1234",
  //     password: "Password"
  //   }


  //   const { body: tokenPayload } = await api
  //     .post(loginUrl)
  //     .send(loginInfo)
  //     .expect(200)
  //     .expect("Content-Type", /application\/json/)

  const newBlog = {
    title: "Total invent",
    author: "me",
    url: "invent.com",
    likes: 10
  }

  await api.post(blogsUrl)
    // .set("Authorization", `Bearer ${tokenPayload.token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)


})


afterAll(() => {
  mongoose.connection.close();
})