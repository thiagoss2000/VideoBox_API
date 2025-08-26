import { getDB } from "../config/db.js"

export async function findByUserId(userId) {
    const db = getDB()
    return db.collection("sessions").findOne({ user_id: userId })
}

export async function create({ userId, token }) {
    const db = getDB()
    return db.collection("sessions").insertOne({ user_id: userId, token })
}

export async function findSessionByToken(token) {
    const db = getDB()
    return db.collection("sessions").findOne({ token })
}