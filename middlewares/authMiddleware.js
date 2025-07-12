import db from "../db.js"

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.token

  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.replace('Bearer ', '')

  try {
    const session = await db.collection("sessions").findOne({ token })

    if (!session) return res.sendStatus(401)

    req.userId = session.user_id
    next()
  } catch (e) {
    console.log(e)
    return res.sendStatus(500)
  }
}