import { getDB } from "../config/db.js"

export async function updateByUser(userId, data) {
    const db = getDB()
    return db.collection("preferences").updateOne(
        { user: userId },
        { $set: data },
        { upsert: true }
    )
}

export async function addToSet(userId, addData) {
    const db = getDB()
    return db.collection("preferences").updateOne(
        { user: userId },
        { $addToSet: addData },
        { upsert: true }
    )
}

export async function pull(userId, pullData) {
    const db = getDB()
    return db.collection("preferences").updateOne(
        { user: userId },
        { $pull: pullData }
    )
}

export async function findByUser(userId) {
    const db = getDB()
    return db.collection("preferences").findOne({ user: userId })
}