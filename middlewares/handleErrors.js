const errors = {
  TokenExpiredError: (req, res) => {
    res.status(401).send("Token expired")
  },
  JsonWebTokenError: (req, res) => {
    res.status(401).send("Invalid token")
  },
  InvalidRequest: (req, res) => {
    res.status(400).send("Invalid request")
  },
  defaultError: (req, res) => {
    res.status(500).end()
  }
}

export function errorHandler (err, req, res) {
  return errors[err.name] ? errors[err.name](req, res) : errors.defaultError(req, res)
}