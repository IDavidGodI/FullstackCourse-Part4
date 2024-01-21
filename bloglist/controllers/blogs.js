const blogsRouter = require("express").Router();
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post("/", async (request, response, next) => {

  if (!request.body.likes){
    request.body.likes = 0;
  }


  if (!request.body.title || !request.body.url){
    console.log("error", request.body)
    return response.status(400).end()
  }

  const blog = new Blog(request.body)

  await blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter