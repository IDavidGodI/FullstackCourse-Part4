const blogsRouter = require("express").Router();
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {

  const blog = new Blog(request.body)

  const savedblog = await blog.save()
  response.status(201).json(savedblog)
})

blogsRouter.delete("/:id", async (request, response) => {

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
})

blogsRouter.put("/:id", async (request, response) => {


  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true, context: "query" })

  response.json(updatedNote)
})

module.exports = blogsRouter