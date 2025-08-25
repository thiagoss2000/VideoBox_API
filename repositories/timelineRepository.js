import db from "../db.js"

export async function replaceTimeline(userId, data) {
    return db.collection("timeline").replaceOne(
        { user: userId },
        { user: userId, ...data },
        { upsert: true }
    )
}

export async function findByUser(userId) {
    return db.collection("timeline").findOne({ user: userId })
}