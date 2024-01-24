const mongoose = require("mongoose");
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const { head } = require("lodash")

const api = supertest(app)



beforeAll(async () => {
  await helper.clearBlogs()
  await helper.clearUsers()
})

test("User is created correctly", async () => {
  const user = {
    userName: "toRepeat",
    name: "My user name wont be repeated",
    password: "SuperSecret123"
  }

  const createdUser = await api
    .post(helper.URLs.usersUrl)
    .send(user)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  expect(createdUser.body.userName).toBe(user.userName)
  expect(createdUser.body.name).toBe(user.name)

})

test("A username cant be repeated", async () => {
  const user = {
    userName: "toRepeat",
    name: "I will repeat the user name >:)",
    password: "SuperSecret123"
  }

  const { body: error } = await api
    .post(helper.URLs.usersUrl)
    .send(user)
    .expect(400)

  console.log("Error", error)

})

test("If password or username are invalid there's a 400 status code", async () => {
  const user = {
    userName: "Error",
    name: "Invalid Data Provider",
    password: "No"
  }

  await api
    .post(helper.URLs.usersUrl)
    .send(user)
    .expect(400)
    .expect("Content-Type", /application\/json/)

})


describe("A registered user with a valid token can use the api without problems", () => {

  test("A registerd user can login and get a token", async () => {
    const user = {
      userName: "BlogCreator",
      name: "Im the Creator of the blog",
      password: "CreatBlogs"
    }

    await api
      .post(helper.URLs.usersUrl)
      .send(user)

    const loginInfo = {
      userName: "BlogCreator",
      password: "CreatBlogs"
    }


    await api
      .post(helper.URLs.loginUrl)
      .send(loginInfo)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("A logged in user can post a blog", async () => {
    const loginInfo = {
      userName: "BlogCreator",
      password: "CreatBlogs"
    }


    const { body: tokenPayload } = await api
      .post(helper.URLs.loginUrl)
      .send(loginInfo)

    const newBlog = {
      title: "My created blog",
      author: "BlogCreator",
      url: "creation.com",
      likes: 9
    }

    await api.post(helper.URLs.blogsUrl)
      .set("Authorization", `Bearer ${tokenPayload.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  })

  test("A logged in user can delete a blog only if it belongs to him", async () => {
    const user = {
      userName: "notOwner",
      name: "Im not the owner of the blog",
      password: "deletingblog"
    }

    await api
      .post(helper.URLs.usersUrl)
      .send(user)


    const loginInfo = {
      userName: "notOwner",
      password: "deletingblog"
    }


    const { body: tokenPayload } = await api
      .post(helper.URLs.loginUrl)
      .send(loginInfo)

    const { id: blogId } = head(await helper.blogsInDb())

    const { body: error } = await api
      .delete(`${helper.URLs.blogsUrl}/${blogId}`)
      .set("Authorization", `Bearer ${tokenPayload.token}`)
      .expect(401)

    console.log(error.error)

    expect(error.error).toBe("A blog can only be deleted by its creator")

  })

  test("The creator of the blog can delete it", async () => {
    const loginInfo = {
      userName: "BlogCreator",
      password: "CreatBlogs"
    }


    const { body: tokenPayload } = await api
      .post(helper.URLs.loginUrl)
      .send(loginInfo)

    const initialBlogs = await helper.blogsInDb()
    const { id: blogId } = head(initialBlogs)
    await api
      .delete(`${helper.URLs.blogsUrl}/${blogId}`)
      .set("Authorization", `Bearer ${tokenPayload.token}`)
      .expect(204)

    const finalBlogs = await helper.blogsInDb()

    expect(finalBlogs).not.toContainEqual(head(initialBlogs))
    expect(finalBlogs).toHaveLength(initialBlogs.length - 1)
  })
})


afterAll(() => {
  mongoose.connection.close();
})