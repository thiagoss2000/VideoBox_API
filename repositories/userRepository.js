import db from "../db.js"

export async function findByEmail(email) {
	return db.collection("users").findOne({ email })
}

export async function create(user) {
	const result = await db.collection("users").insertOne(user)
	return result.insertedId
}