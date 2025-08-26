import { validateSession } from "../services/authServices.js"

export async function authMiddleware(req, res, next) {
	const authHeader = req.headers.token
	if (!authHeader) return res.sendStatus(401)

	const token = authHeader.replace("Bearer ", "")

	try {
		const session = await validateSession(token)
		req.userId = session.user_id
		next()
	} catch (err) {
		if (err.code === "UNAUTHORIZED") return res.sendStatus(401)
		console.error(err)
		return res.sendStatus(500)
	}
}