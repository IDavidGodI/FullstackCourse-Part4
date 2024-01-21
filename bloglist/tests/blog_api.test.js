const mongoose = require("mongoose");
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog");
const { head } = require("lodash");
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

describe("The data is received appropriately from the database and the backend", () => {

  test("Blogs are returned as json", async () => {
    await api
      .get(blogsUrl)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("Specific blog is contained",async () => {
    const response = await helper.blogsInDb();

    response.forEach((blog, i) => {
      expect(blog.author).toEqual(helper.initialBlogs[i].author)
      expect(blog.likes).toEqual(helper.initialBlogs[i].likes)
      expect(blog.title).toEqual(helper.initialBlogs[i].title)
      expect(blog.url).toEqual(helper.initialBlogs[i].url)
    })
  })

})

describe("Data is sent correctly to the database", () => {
  test("Posting a new blog increases the array length", async () => {
    const newBlog = {
      title: "Total invent",
      author: "me",
      url: "invent.com",
      likes: 10
    }

    const postedBlog = await api
      .post(blogsUrl)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogs = await helper.blogsInDb();
    expect(blogs)
      .toHaveLength(helper.initialBlogs.length + 1)

    expect(postedBlog.body.author).toEqual(newBlog.author)
    expect(postedBlog.body.likes).toEqual(newBlog.likes)
    expect(postedBlog.body.title).toEqual(newBlog.title)
    expect(postedBlog.body.url).toEqual(newBlog.url)

  })
})


describe("Handling missing properties", () => {

  test("The unique identifier is 'id' property", async () => {
    const response = await helper.blogsInDb();

    response.forEach(blog => expect(blog.id).toBeDefined())

  })
  test("likes default value is 0", async () => {
    const newBlog = {
      title: "Total invent",
      author: "me",
      url: "invent.com",
    }

    const postedBlog = await api
      .post(blogsUrl)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(postedBlog.body.likes).toBeDefined()
    expect(postedBlog.body.likes).toBe(0)
  })

  test("title missing", async () => {
    const newBlog = {
      author: "me",
      url: "invent.com",
    }

    await api
      .post(blogsUrl)
      .send(newBlog)
      .expect(400)
  })

  test("url missing", async () => {
    const newBlog = {
      title: "a",
      author: "me",
    }

    await api
      .post(blogsUrl)
      .send(newBlog)
      .expect(400)
  })
})

describe("Deleting a blog", () => {
  test("Deleting a blog by its 'id'", async () => {
    const blogs = await helper.blogsInDb();
    const blog = head(blogs)

    await api.delete(`${blogsUrl}/${blog.id}`)
      .expect(204)

    const currentBlogs = await helper.blogsInDb();

    expect(currentBlogs).toHaveLength(blogs.length - 1)


    expect(currentBlogs).toContainEqual(currentBlogs[0])
    expect(currentBlogs).not.toContainEqual(blog)
  })
})

describe("Updating the info of an specific blog", () => {
  test("Updating a full blog", async () => {

    const update = {
      title: "Updated title",
      author: "Updated author",
      url: "Updated url",
      likes: 7
    }
    const blogs = await helper.blogsInDb();
    const blog = head(blogs)


    const updatedblog = await api.put(`${blogsUrl}/${blog.id}`)
      .send(update)
      .expect(200)


    expect(updatedblog.body.author).toEqual(update.author)
    expect(updatedblog.body.title).toEqual(update.title)
    expect(updatedblog.body.url).toEqual(update.url)
    expect(updatedblog.body.likes).toEqual(update.likes)
  })

  test("Updating a blog with missing properties should maintain those missing values unchanged", async () => {

    const update = {
      title: "Updated title",
      author: "Updated author"
    }
    const blogs = await helper.blogsInDb();
    const blog = head(blogs)

    const updatedblog = await api.put(`${blogsUrl}/${blog.id}`)
      .send(update)
      .expect(200)

    expect(updatedblog.body.author).toEqual(update.author)
    expect(updatedblog.body.title).toEqual(update.title)
    expect(updatedblog.body.url).toEqual(blog.url)
    expect(updatedblog.body.likes).toEqual(blog.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close();
})