import { getDB } from "../config/db.js"

export async function replaceTimeline(userId, data) {
    const db = getDB()
    return db.collection("timeline").replaceOne(
        { user: userId },
        { user: userId, ...data },
        { upsert: true }
    )
}

export async function findByUser(userId) {
    const db = getDB()
    return db.collection("timeline").findOne({ user: userId })
}

export async function deleteByUserId(userId) {
    const db = getDB();
    return db.collection("timeline").deleteMany({ user: userId });
}