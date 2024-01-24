const jwt = require("jsonwebtoken")
const User = require("../models/user")


const unknown = (req, res) => {
  res.status(404).send("<h1>Not found!</h1>")
}



const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }else if (error.name ===  "JsonWebTokenError") {
    return res.status(401).json({ error: error.message })
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" })
  }

  next(error)
}

const tokenExtractor = (req,res,next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "")
  }
  next()
}

const userExtractor = async (req,res,next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) return res.status(401).json({ error: "token invalid" })

  const user = await User.findById(decodedToken.id)

  if (!user) return res.status(401).json({ error: "user not found" })

  req.user = user;

  next()
}

module.exports = {
  unknown,
  errorHandler,
  tokenExtractor,
  userExtractor
}