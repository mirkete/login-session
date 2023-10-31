import { Router } from "express"
import { UsersController } from "../controllers/users.js"

export function mainRoutes ({ model }) {
  const mainRouter = Router()
  const usersController = new UsersController({ model })

  mainRouter.get("/protected", usersController.protectedRoute)
  mainRouter.get("/login", usersController.loginUser)
  mainRouter.post("/login", usersController.createUser)

  return mainRouter
}