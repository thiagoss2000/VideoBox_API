import { getDB } from "../config/db.js"

export async function findByEmail(email) {
	const db = getDB()
	return db.collection("users").findOne({ email })
}

export async function create(user) {
	const db = getDB()
	const result = await db.collection("users").insertOne(user)
	return result.insertedId
}