const unknown = () => {

}

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }else if (error.name ===  "JsonWebTokenError") {
    return res.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  unknown,
  errorHandler
}