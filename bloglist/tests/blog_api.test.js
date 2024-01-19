const mongoose = require("mongoose");
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog");
const { initial } = require("lodash");
const helper = require("../utils/test_helper")
const api = supertest(app)

const blogsUrl = "/api/blogs";


beforeAll(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs){
    const blogObject = new Blog(blog)
    await blogObject.save()
  }

})

test("Blogs are returned as json", async () => {
  await api
    .get(blogsUrl)
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("Specific blog is contained",async () => {
  const response = await api.get(blogsUrl)

  response.body.forEach((blog, i) => {
    expect(blog.author).toEqual(helper.initialBlogs[i].author)
    expect(blog.likes).toEqual(helper.initialBlogs[i].likes)
    expect(blog.title).toEqual(helper.initialBlogs[i].title)
    expect(blog.url).toEqual(helper.initialBlogs[i].url)
  })
})

test("The unique identifier is 'id' property", async () => {
  const response = await api.get(blogsUrl)

  response.body.forEach(blog => expect(blog.id).toBeDefined())

})

test("Posting a new blog increases the array length", async () => {
  const newBlog = {
    title: "Total invent",
    author: "me",
    url: "invent.com",
    likes: 0
  }

  const postedBlog = await api
    .post(blogsUrl)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogs = await api.get(blogsUrl)

  console.log(postedBlog.body)
  expect(blogs.body.length)
    .toBe(helper.initialBlogs.length + 1)

  expect(postedBlog.body.author).toEqual(newBlog.author)
  expect(postedBlog.body.likes).toEqual(newBlog.likes)
  expect(postedBlog.body.title).toEqual(newBlog.title)
  expect(postedBlog.body.url).toEqual(newBlog.url)

})

afterAll(async () => {
  await mongoose.connection.close();
})