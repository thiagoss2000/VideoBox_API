import db from "../db.js"

export async function findByUserId(userId) {
    return db.collection("sessions").findOne({ user_id: userId })
}

export async function create({ userId, token }) {
    return db.collection("sessions").insertOne({ user_id: userId, token })
}