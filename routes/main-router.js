import { Router } from "express"
import { UsersController } from "../controllers/users.js"

export function mainRoutes ({ model }) {
  const mainRouter = Router()
  const usersController = new UsersController({ model })

  mainRouter.get("/protected", usersController.protectedRoute)
  mainRouter.get("/register", usersController.registerPage)
  mainRouter.get("/login", usersController.loginPage)
  mainRouter.post("/register", usersController.createUser)
  mainRouter.post("/login", usersController.loginUser)

  return mainRouter
}