const bcrypt = require("bcrypt")
const usersRouter = require("express").Router();
const User = require("../models/user")


usersRouter.post("/", async (req, res) => {

  const { userName, name, password } = req.body;

  if (!password || password.length < 3)
    return res.status(400).json({ message: "The password must be at least 3 characters" })

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    userName,
    name,
    passwordHash
  })


  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

usersRouter.get("/", async (req,res) => {
  const users = await User.find({})
  console.log(users)
  res.json(users)
})

module.exports = usersRouter