import db from "../db.js"
import joi from "joi";

export async function createFolder(req, res) {
    const { body, userId } = req

    const authSchema = joi.object({
        folderName: joi.string().required().min(1)
    })

    const validation = authSchema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map((e) => e.message))
    
    const newFolder = {
        name: body.folderName,
        createdAt: new Date(),
        videos: []
    }

    try {             
        const result = await db.collection("folders").updateOne(
            { user: userId, "folders.name": { $ne: body.folderName } }, // só insere se não existir pasta com mesmo nome
            { $push: { folders: newFolder } },
            { upsert: true }
        )

        if (result.modifiedCount === 0) 
            return res.status(409).send("Pasta já existe")

        return res.sendStatus(200)
    } catch {
        return res.sendStatus(500)
    }
}

export async function editFolderName(req, res) {
    const { body, userId } = req

    const authSchema = joi.object({
        folderName: joi.string().required().min(1),
        newFolderName: joi.string().required().min(1)
    })

    const validation = authSchema.validate(body, { abortEarly: false })
    if (validation.error) 
        return res.status(422).send(validation.error.details.map((e) => e.message))

    try {             
        const result = await db.collection("folders").updateOne(
            { user: userId, "folders.name": body.folderName },
            { $set: { "folders.$.name": body.newFolderName } } // substitui o nome
        )
        if (result.matchedCount === 0) 
            return res.status(404).send("Pasta não encontrada") 
        if (result.modifiedCount === 0) 
            return res.status(409).send("Novo nome é igual ao atual")

        return res.sendStatus(200)
    } catch {
        return res.sendStatus(500)
    }
}

export async function deleteFolder(req, res) {
    const { body, userId } = req

    const authSchema = joi.object({
        folderName: joi.string().required().min(1)
    })

    const validation = authSchema.validate(body, { abortEarly: false })
    if (validation.error) 
        return res.status(422).send(validation.error.details.map((e) => e.message))

    try {             
        const result = await db.collection("folders").updateOne({user: userId}, { $pull: { folders: { name: body.folderName }}})
        if (result.modifiedCount === 0) {
            return res.status(404).send("Pasta não encontrada")
        }
        return res.sendStatus(200)
    } catch {
        return res.sendStatus(500)
    }
}

export async function getFolders(req, res) {
    const { userId } = req

     try {             
        const folders = await db.collection("folders").find({ user: userId }).toArray()
        return res.status(200).send(folders);
    } catch {
        return res.sendStatus(500)
    }
}

export async function addVideo(req, res) {
    const { body, userId } = req
    
    const authSchema = joi.object({
        folderName: joi.string().required().min(1),
        videoId: joi.string().required().min(1),
        videoTag: joi.string()
    })
    const validation = authSchema.validate(body, { abortEarly: false })

    if (validation.error) 
        return res.status(422).send(validation.error.details.map((e) => e.message))
    
    try {         
        const listVideos = await db.collection("timeline").findOne(
            { user: userId }, 
            { projection: { searchVideos: 1, recommendations: 1, _id: 0 } }
        )
        if (!listVideos) 
            throw new Error("denatured collection")
            
        const fromSearch = listVideos.searchVideos?.find(v => v.videoId == body.videoId)
        const fromrec = fromSearch ? fromSearch : listVideos.recommendations?.find(v => v.videoId == body.videoId)
         
        if (fromrec) {
            fromrec.videoTag = body.videoTag ? body.videoTag : ""
            const result = await db.collection("folders").updateOne({ user: userId, "folders.name": body.folderName },
            { $addToSet: { "folders.$.videos": fromrec } })

            if (result.matchedCount === 0) 
                return res.status(404).send("pasta não encontrada")
            if (result.modifiedCount === 0)
                return res.status(409).send("pasta já contém esse vídeo")

        } else {
            return res.status(404).send("vídeo indisponível")   /* ## ADICIONAR TENTATIVA DE BUSCA NA API ## */
        }

        return res.sendStatus(200)
    } catch {
        return res.sendStatus(500)
    }
}

export async function editTagVideo(req, res) {
    const { body, userId } = req
    
    const authSchema = joi.object({
        folderName: joi.string().required().min(1),
        videoId: joi.string().required().min(1),
        videoTag: joi.string().required()
    })
    const validation = authSchema.validate(body, { abortEarly: false })

    if (validation.error)
        return res.status(422).send(validation.error.details.map((e) => e.message))
 
    try {                 
        const result = await db.collection("folders").updateOne(
            { user: userId, "folders.name": body.folderName, "folders.videos.videoId": body.videoId },
            { $set: { "folders.$[f].videos.$[v].videoTag": body.videoTag } },
            {
                arrayFilters: [
                    { "f.name": body.folderName },
                    { "v.videoId": body.videoId }
                ]
            }
        )

        if (result.matchedCount === 0) 
            return res.status(404).send({ message: "Pasta não encontrada" })
        if (result.modifiedCount === 0) 
            return res.status(304).send({ message: "Nenhuma alteração feita" })

        return res.status(200).send({ message: "videoTag alterada" })
    } catch {
        return res.sendStatus(500)
    }
}

export async function deleteVideo(req, res) {
    const { body, userId } = req
    
    const authSchema = joi.object({
        folderName: joi.string().required().min(1),
        videoId: joi.string().required().min(1)
    })
    const validation = authSchema.validate(body, { abortEarly: false })

    if (validation.error)
        return res.status(422).send(validation.error.details.map((e) => e.message))
 
    try {                 
        const result = await db.collection("folders").updateOne(
            { user: userId, "folders.name": body.folderName },
            { $pull: { "folders.$.videos": { videoId: body.videoId } } }
        )

        if (result.matchedCount === 0) 
            return res.status(404).send({ message: "Pasta não encontrada" })
        if (result.modifiedCount === 0) 
            return res.status(404).send({ message: "Vídeo não encontrado na pasta" })

        return res.status(200).send({ message: "Vídeo removido com sucesso" })
    } catch {
        return res.sendStatus(500)
    }
}

export async function editFolderNotes(req, res) {   /* ## PROVISÓRIO ## */
    const { body, userId } = req                        /* criar array com anotações 'text' e data de criação*/

    const authSchema = joi.object({
        folderName: joi.string().required().min(1),
        text: joi.string().required()
    })

    const validation = authSchema.validate(body, { abortEarly: false })
    if (validation.error) 
        return res.status(422).send(validation.error.details.map((e) => e.message))

    try {             
        const result = await db.collection("folders").updateOne(
            { user: userId, "folders.name": body.folderName },
            { $set: { "folders.$.notes": body.text } } // substitui o texto
        )
        if (result.matchedCount === 0) 
            return res.status(404).send("Pasta não encontrada") 
        if (result.modifiedCount === 0) 
            return res.status(304).send("não há alteração de texto")

        return res.sendStatus(200)
    } catch {
        return res.sendStatus(500)
    }
}
