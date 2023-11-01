import crypto from "node:crypto"
import jwt from "jsonwebtoken"
import mysql from "mysql2/promise"

const SECRET_KEY = "My secret key here"
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mirkito18",
  database: "jwt"
})

async function getUser (token) {
  const splittedToken = token.split(" ")[1]
  return jwt.verify(splittedToken, SECRET_KEY)
}

async function createUser (userData) {
  const id = crypto.randomUUID()
  const userForToken = {
    id,
    ...userData
  }

  const token = jwt.sign(userForToken, SECRET_KEY)

  return token
}

export class UsersModel {
  static protectedRoute = async (token) => {
    if (!token) {
      return { success: false }
    }
    let user
    try {
      user = await getUser(token)
    } catch (error) {
      return { success: false, error }
    }

    return { success: true, data: `<h1>PROTECTED DATA. Hi ${user.username} </h1>` }
  }

  static createUser = async (user) => {
    if (!user) {
      return { success: false, error: { name: "Invalid Request" } }
    }

    let token
    try {
      token = await createUser(user)
    } catch (error) {
      return { success: false, error }
    }

    return { success: true, data: token }
  }
}