import crypto from "node:crypto"
import jwt from "jsonwebtoken"

const SECRET_KEY = "My secret key here"

async function getUser (token) {
  const splittedToken = token.split(" ")[1]
  let user
  try {
    user = jwt.verify(splittedToken, SECRET_KEY)
    return user
  } catch (e) {
    console.log(e)
    return null
  }
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

    const user = await getUser(token)
    if (!user) {
      return { sucess: false }
    }

    return { success: true, data: `<h1>PROTECTED DATA. Hi ${user.username} </h1>` }
  }

  static createUser = async (user) => {
    if (!user) {
      return { success: false }
    }

    try {
      const token = await createUser(user)
      return { success: true, data: token }
    } catch (e) {
      console.error(e)
      return { success: false }
    }
  }
}