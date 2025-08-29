import * as folderRepository from "../repositories/folderRepository.js"
import * as timelineRepository from "../repositories/timelineRepository.js"

export async function createFolder(userId, folderName) {
    const newFolder = { name: folderName, createdAt: new Date(), videos: [] }
    const exists = await folderRepository.findFolderByName(userId, folderName)
    if (exists) throw { code: "FOLDER_EXISTS" }
    await folderRepository.insertFolder(userId, newFolder)
}

export async function editFolderName(userId, oldName, newName) {
    const exists = await folderRepository.findFolderByName(userId, newName)
    if (exists) throw { code: "NAME_CONFLICT" }
    const result = await folderRepository.updateFolderName(userId, oldName, newName)
    if (result.matchedCount === 0) throw { code: "NOT_FOUND" }
}

export async function editFolderDays(userId, folderName, days) {
    const exists = await folderRepository.findFolderByName(userId, folderName)
    if (!exists) throw { code: "NOT_FOUND" }
    const result = await folderRepository.updateFolderDays(userId, folderName, days)
    if (result.matchedCount === 0) throw { code: "NOT_FOUND" }
}

export async function deleteFolder(userId, folderName) {
    const result = await folderRepository.removeFolder(userId, folderName)
    if (result.modifiedCount === 0) throw { code: "NOT_FOUND" }
}

export async function getFolders(userId) {
    return folderRepository.findFolders(userId)
}

export async function addVideo(userId, folderName, videoId, videoTag) {
    const listVideos = await timelineRepository.findByUser(userId)
    if (!listVideos) throw new Error("denatured collection")

    const fromSearch = listVideos.searchVideos?.find(v => v.videoId == videoId)
    const fromRec = fromSearch || listVideos.recommendations?.find(v => v.videoId == videoId)
    if (!fromRec) throw { code: "NOT_FOUND_VIDEO" }

    fromRec.videoTag = videoTag || ""

    const saveVideos = await folderRepository.findFolderByName(userId, folderName)
    const folderItens = saveVideos.folders.find(folder => folder.name == folderName)

    const videoExist = await folderItens.videos.find(video => video.videoId == videoId)
    if (videoExist) throw { code: "ALREADY_EXISTS" }

    fromRec._id = (folderItens.videos.length + 1)

    const result = await folderRepository.addVideo(userId, folderName, fromRec)
    if (result.matchedCount === 0) throw { code: "NOT_FOUND_FOLDER" }
}

export async function editTagVideo(userId, folderName, videoId, videoTag) {
    const result = await folderRepository.updateVideoTag(userId, folderName, videoId, videoTag)
    if (result.matchedCount === 0) throw { code: "NOT_FOUND" }
    if (result.modifiedCount === 0) throw { code: "NO_CHANGE" }
}

export async function deleteVideo(userId, folderName, videoId) {
    const result = await folderRepository.removeVideo(userId, folderName, videoId)
    if (result.matchedCount === 0) throw { code: "NOT_FOUND_FOLDER" }
    if (result.modifiedCount === 0) throw { code: "NOT_FOUND_VIDEO" }
    const saveVideos = await folderRepository.findFolderByName(userId, folderName)
    const folderItens = saveVideos.folders.find(folder => folder.name == folderName)
    if (!folderItens) throw { code: "NOT_FOUND_FOLDER" }
    folderItens.videos.forEach((v, idx) => {    
        v._id = idx + 1
    })  // Salva a pasta atualizada com os novos _ids
    await folderRepository.updateFolderVideos(userId, folderName, folderItens.videos)
}

export async function editFolderNotes(userId, folderName, text) {
    const result = await folderRepository.updateNotes(userId, folderName, text)
    if (result.matchedCount === 0) throw { code: "NOT_FOUND" }
    if (result.modifiedCount === 0) throw { code: "NO_CHANGE" }
}