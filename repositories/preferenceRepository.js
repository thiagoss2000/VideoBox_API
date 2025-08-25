import db from "../db.js"

export async function updateByUser(userId, data) {
    return db.collection("preferences").updateOne(
        { user: userId },
        { $set: data },
        { upsert: true }
    )
}

export async function addToSet(userId, addData) {
    return db.collection("preferences").updateOne(
        { user: userId },
        { $addToSet: addData },
        { upsert: true }
    )
}

export async function pull(userId, pullData) {
    return db.collection("preferences").updateOne(
        { user: userId },
        { $pull: pullData }
    )
}

export async function findByUser(userId) {
    return db.collection("preferences").findOne({ user: userId })
}