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
  return new Promise(async (resolve, reject) => {
    const { username, password } = user

    let result
    try {
      result = await connection.execute(
        'SELECT BIN_TO_UUID(id) AS id, username FROM users ' +
        'WHERE username = ? AND password = ?',
        [username, password]
      )
    } catch (error) {
      return reject(error)
    }

    const userForToken = result[0][0]
    if (!userForToken || Object.keys(userForToken).length !== 2) return reject({ name: "UserNotFound" })

    const token = jwt.sign(userForToken, SECRET_KEY)
    return resolve(token)
  })
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
    if (!(user && user.username && user.password)) {
      return { success: false, error: { name: "InvalidRequest" } }
    }

    let token
    try {
      token = await logUser(user)
    } catch (error) {
      return { success: false, error }
    }

    return { success: true, data: token }
  }
}