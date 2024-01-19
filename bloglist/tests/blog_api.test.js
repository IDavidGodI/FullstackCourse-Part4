const mongoose = require("mongoose");
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog");
const { initial } = require("lodash");
const helper = require("../utils/test_helper")
const api = supertest(app)

const blogsUrl = "/api/blogs";


beforeAll(async () => {
  Blog.deleteMany([]);

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save();
})

test("Blogs are returned as json", async () => {
  await api
    .get(blogsUrl)
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("Specific blog is contained",async () => {
  const response = await api.get(blogsUrl)
  expect(response.body[1].author).toEqual(helper.initialBlogs[1].author)
  expect(response.body[1].likes).toEqual(helper.initialBlogs[1].likes)
  expect(response.body[1].title).toEqual(helper.initialBlogs[1].title)
  expect(response.body[1].url).toEqual(helper.initialBlogs[1].url)
})

test("The unique identifier is 'id' property", async () => {
  const response = await api.get(blogsUrl)

  response.body.forEach(blog => expect(blog.id).toBeDefined())

})

afterAll(async () => {
  await mongoose.connection.close();
})