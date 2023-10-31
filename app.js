import express from "express"
import { join } from "node:path"
import { mainRoutes } from "./routes/main-router.js"
import { UsersModel } from "./models/users.js"

const app = express()

app.use(express.static(join(process.cwd(), "web")))
app.use(express.json())

app.use(mainRoutes({ model: UsersModel }))

app.listen(3000, () => { console.log("SERVER LISTENING ON PORT 3000") })

