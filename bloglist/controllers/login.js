const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
  const { userName, password } = req.body

  const user = await User.findOne({ userName })

  if (!user || !bcrypt.compare(password, user.passwordHash)){
    return res.status(401).json({
      error: "invalid username or password"
    })
  }

  const userForToken = {
    username: user.userName,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res
    .json({ token, username: user.userName, name: user.name })
})

module.exports = loginRouter