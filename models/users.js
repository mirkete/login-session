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
  return new Promise(async (resolve, reject) => {

    const id = crypto.randomUUID()
    if (!userData.username || !userData.password) {
      reject({ name: "InvalidRequest" })
      return
    }

    const { username, password } = userData
    const token = jwt.sign({ id, username, password }, SECRET_KEY)

    await connection.execute(
      'INSERT INTO users (id, username, password) ' +
      'VALUES (UUID_TO_BIN(?), ?, ?)',
      [id, username, password]
    )

    return resolve(token)
  })
}

async function logUser (user) {
  // Check in DB and return token here
}

export class UsersModel {
  static protectedRoute = async (token) => {
    if (!token) {
      return { success: false, error: { name: "InvalidRequest" } }
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
      return { success: false, error: { name: "InvalidRequest" } }
    }

    let token
    try {
      token = await createUser(user)
    } catch (error) {
      return { success: false, error }
    }

    return { success: true, data: token }
  }

  static loginUser = async (user) => {
    // Communicate with logUser function
  }
}