import { getDB } from "../config/db.js"
import { ObjectId } from "mongodb";

export async function findByEmail(email) {
	const db = getDB()
	return db.collection("users").findOne({ email })
}

export async function create(user) {
	const db = getDB()
	const result = await db.collection("users").insertOne(user)
	return result.insertedId
}

export async function findById(userId) {
	const db = getDB()
	return db.collection("users").findOne({ _id: new ObjectId(userId) })
}
  
export async function deleteById(userId) {
	const db = getDB()
	return db.collection("users").deleteOne({ _id: new ObjectId(userId) })
}     
  