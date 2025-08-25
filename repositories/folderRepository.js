import db from "../db.js"

export async function insertFolder(userId, newFolder) {
    return db.collection("folders").updateOne(
        { user: userId },
        { $addToSet: { folders: newFolder } },
        { upsert: true }
    )
}

export async function updateFolderName(userId, folderName, newFolderName) {
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $set: { "folders.$.name": newFolderName } }
    )
}

export async function removeFolder(userId, folderName) {
    return db.collection("folders").updateOne(
        { user: userId },
        { $pull: { folders: { name: folderName } } }
    )
}

export async function findFolders(userId) {
    return db.collection("folders").find({ user: userId }).toArray()
}

export async function findFolderByName(userId, folderName) {
    return db.collection("folders").findOne({
        user: userId,
        "folders.name": folderName
    })
}

export async function addVideo(userId, folderName, video) {
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $addToSet: { "folders.$.videos": video } }
    )
}

export async function updateVideoTag(userId, folderName, videoId, videoTag) {
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName, "folders.videos.videoId": videoId },
        { $set: { "folders.$[f].videos.$[v].videoTag": videoTag } },
        {
        arrayFilters: [
            { "f.name": folderName },
            { "v.videoId": videoId }
        ]
        }
    )
}

export async function removeVideo(userId, folderName, videoId) {
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $pull: { "folders.$.videos": { videoId } } }
    )
}

export async function updateNotes(userId, folderName, text) {
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $set: { "folders.$.notes": text } }
    )
}