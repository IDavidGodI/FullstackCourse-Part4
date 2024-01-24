const blogsRouter = require("express").Router();
const Blog = require("../models/blog")

const { userExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate("user",{ userName: 1, name: 1 })
  res.json(blogs)
})
blogsRouter.get("/:id", async (req, res) => {
  const blogs = await Blog
    .findById(req.params.id)
    .populate("user",{ userName: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post("/", userExtractor, async (req, res) => {
  const body = req.body

  const user = req.user;

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedblog = await blog.save()
  user.blogs = user.blogs.concat(savedblog)
  await user.save();

  res.status(201).json(savedblog)
})

blogsRouter.delete("/:id", userExtractor, async (req, res) => {

  const user = req.user;

  if (!user.blogs.includes(req.params.id))
    return res.status(401).json({ error: "A blog can only be deleted by its creator" })

  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).end();
})

blogsRouter.put("/:id", async (req, res) => {


  const updatedNote = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: "query" })

  res.json(updatedNote)
})

module.exports = blogsRouter