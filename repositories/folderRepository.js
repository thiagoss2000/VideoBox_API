import { ObjectId } from "mongodb"
import { getDB } from "../config/db.js"

export async function insertFolder(userId, newFolder) {
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId },
        { $addToSet: { folders: newFolder } },
        { upsert: true }
    )
}

export async function updateFolderName(userId, folderName, newFolderName) {
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $set: { "folders.$.name": newFolderName } }
    )
}

export async function updateFolderDays(userId, folderName, days) {
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $set: { "folders.$.daysOfWeek": days } },
        { upsert: true }
    )
}

export async function removeFolder(userId, folderName) {
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId },
        { $pull: { folders: { name: folderName } } }
    )
}

export async function findFolders(userId) {
    const db = getDB()
    return db.collection("folders").find({ user: userId }).toArray()
}

export async function findFolderByName(userId, folderName) {
    const db = getDB()
    return db.collection("folders").findOne({
        user: userId,
        "folders.name": folderName
    })
}

export async function addVideo(userId, folderName, video) {
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $addToSet: { "folders.$.videos": video } }
    )
}

export async function updateVideoTag(userId, folderName, videoId, videoTag) {
    const db = getDB()
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
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $pull: { "folders.$.videos": { videoId } } }
    )
}

export async function updateFolderVideos(userId, folderName, videos) {
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $set: { "folders.$.videos": videos } }
    )
}

export async function updateNotes(userId, folderName, text) {
    const db = getDB()
    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $set: { "folders.$.notes": text } }
    )
}


export async function pushFolderNote(userId, folderName, noteText) {
    const db = getDB()
    const note = {
        id: new ObjectId(),       // id único da nota
        text: noteText,           // conteúdo
        createdAt: new Date()     // data de criação
    };

    return db.collection("folders").updateOne(
        { user: userId, "folders.name": folderName },
        { $push: { "folders.$.notes": note } }, // adiciona sem sobrescrever
        { upsert: false } // não cria documento novo automaticamente aqui
    );
}

export async function editFolderNote(userId, folderName, noteId, newText) {
  const db = getDB();

  return db.collection("folders").updateOne(
    { user: userId, "folders.name": folderName, "folders.notes.id": ObjectId.createFromHexString(noteId) },
    { $set: { 
        "folders.$[f].notes.$[n].text": newText,
        "folders.$[f].notes.$[n].updatedAt": new Date() // adiciona timestamp da edição
        }},
    {
      arrayFilters: [
        { "f.name": folderName },
        { "n.id": ObjectId.createFromHexString(noteId) }
      ]
    }
  );
}

export async function deleteFolderNote(userId, folderName, noteId) {
  const db = getDB();

  return db.collection("folders").updateOne(
    { user: userId, "folders.name": folderName },
    { $pull: { "folders.$.notes": { id: ObjectId.createFromHexString(noteId) } } }
  );
}