export class UsersController {
  constructor({ model }) {
    this.model = model
  }

  protectedRoute = async (req, res) => {
    const token = req.headers["authorization"]
    const result = await this.model.protectedRoute(token)
    if (!result.success) {
      return res.status(401).send("UNATHORIZED")
    }
    res.status(200).send(result.data)
  }

  loginUser = async (req, res) => {
    res.sendFile(process.cwd() + "/web/login.html")
  }

  createUser = async (req, res) => {

    const result = await this.model.createUser(req.body)
    if (!result.success) {
      return res.status(401).send("Bad request")
    }
    res.status(200).send(result.data)
  }
}