const blogsRouter = require("express").Router();
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }
  return null
}

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

blogsRouter.post("/", async (req, res) => {
  const body = req.body

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) return res.status(404).json({ message: "The user id given is not in the database" })

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

blogsRouter.delete("/:id", async (req, res) => {

  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).end();
})

blogsRouter.put("/:id", async (req, res) => {


  const updatedNote = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: "query" })

  res.json(updatedNote)
})

module.exports = blogsRouter