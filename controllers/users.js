import { errorHandler } from "../middlewares/handleErrors.js"

export class UsersController {
  constructor({ model }) {
    this.model = model
  }

  protectedRoute = async (req, res) => {
    const token = req.headers["authorization"]
    const result = await this.model.protectedRoute(token)
    if (!result.success) {
      return errorHandler(result.error, req, res)
    }

    res.status(200).send(result.data)
  }

  registerPage = async (req, res) => {
    res.sendFile(process.cwd() + "/web/register.html")
  }

  createUser = async (req, res) => {

    const result = await this.model.createUser(req.body)
    if (!result.success) {
      return errorHandler(result.error, req, res)
    }

    res.status(200).send(result.data)
  }

  loginPage = async (req, res) => {
    res.sendFile(process.cwd() + "/web/login.html")
  }

  loginUser = async (req, res) => {
    const result = await this.model.loginUser(req.body)
    if (!result.success) {
      return errorHandler(result.error, req, res)
    }

    res.status(200).send(result.data)
  }
}