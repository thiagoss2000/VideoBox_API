import joi from "joi"
import * as folderService from "../services/folderServices.js"

// cria pasta
export async function createFolder(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        folderName: joi.string().required().min(1)
    })

    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map(e => e.message))

    try {
        await folderService.createFolder(userId, body.folderName)
        return res.sendStatus(200)
    } catch (e) {
        if (e.code === "FOLDER_EXISTS") return res.status(409).send("Pasta já existe")
        console.error(e)
        return res.sendStatus(500)
    }
}

// renomeia pasta
export async function editFolderName(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        folderName: joi.string().required().min(1),
        newFolderName: joi.string().required().min(1)
    })

    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map(e => e.message))

    try {
        await folderService.editFolderName(userId, body.folderName, body.newFolderName)
        return res.sendStatus(200)
    } catch (e) {
        if (e.code === "NOT_FOUND") return res.status(404).send("Pasta não encontrada")
        if (e.code === "NAME_CONFLICT") return res.status(409).send("Já existe uma pasta com esse nome")
        console.error(e)
        return res.sendStatus(500)
    }
}

// edita dias de rotina
export async function editFolderDays(req, res) {
  const { body, userId } = req

  const schema = joi.object({
    folderName: joi.string().required().min(1),
    daysOfWeek: joi.array().items(joi.string().valid(
      "domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"
    )).required()
  })

  const validation = schema.validate(body, { abortEarly: false })
  if (validation.error)
    return res.status(422).send("Dias inválidos")

  try {
    await folderService.editFolderDays(userId, body.folderName, body.daysOfWeek)
    return res.sendStatus(200)
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).send("Pasta não encontrada")
    console.error(e)
    return res.sendStatus(500)
  }
}

// deleta pasta
export async function deleteFolder(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        folderName: joi.string().required().min(1)
    })

    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map(e => e.message))

    try {
        await folderService.deleteFolder(userId, body.folderName)
        return res.sendStatus(200)
    } catch (e) {
        if (e.code === "NOT_FOUND") return res.status(404).send("Pasta não encontrada")
        console.error(e)
        return res.sendStatus(500)
    }
}

// lista pastas
export async function getFolders(req, res) {
    const { userId } = req
    try {
        const folders = await folderService.getFolders(userId)
        return res.status(200).json(folders)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }
}

// adiciona vídeo
export async function addVideo(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        folderName: joi.string().required().min(1),
        videoId: joi.string().required().min(1),
        videoTag: joi.string()
    })
    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map(e => e.message))

    try {
        await folderService.addVideo(userId, body.folderName, body.videoId, body.videoTag)
        return res.sendStatus(200)
    } catch (e) {
        if (e.code === "NOT_FOUND_FOLDER") return res.status(404).send("pasta não encontrada")
        if (e.code === "NOT_FOUND_VIDEO") return res.status(404).send("vídeo indisponível")
        if (e.code === "ALREADY_EXISTS") return res.status(409).send("pasta já contém esse vídeo")
        console.error(e)
        return res.sendStatus(500)
    }
}

// edita tag
export async function editTagVideo(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        folderName: joi.string().required().min(1),
        videoId: joi.string().required().min(1),
        videoTag: joi.string().required()
    })
    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map(e => e.message))

    try {
        await folderService.editTagVideo(userId, body.folderName, body.videoId, body.videoTag)
        return res.status(200).send({ message: "videoTag alterada" })
    } catch (e) {
        if (e.code === "NOT_FOUND") return res.status(404).send("Pasta não encontrada")
        if (e.code === "NO_CHANGE") return res.status(304).send("Nenhuma alteração feita")
        console.error(e)
        return res.sendStatus(500)
    }
}

// remove vídeo
export async function deleteVideo(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        folderName: joi.string().required().min(1),
        videoId: joi.string().required().min(1)
    })
    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map(e => e.message))

    try {
        await folderService.deleteVideo(userId, body.folderName, body.videoId)
        return res.status(200).send({ message: "Vídeo removido com sucesso" })
    } catch (e) {
        if (e.code === "NOT_FOUND_FOLDER") return res.status(404).send("Pasta não encontrada")
        if (e.code === "NOT_FOUND_VIDEO") return res.status(404).send("Vídeo não encontrado na pasta")
        console.error(e)
        return res.sendStatus(500)
    }
}

// notas da pasta
export async function editFolderNotes(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        folderName: joi.string().required().min(1),
        text: joi.string().required()
    })
    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error)
        return res.status(422).send(validation.error.details.map(e => e.message))

    try {
        await folderService.editFolderNotes(userId, body.folderName, body.text)
        return res.sendStatus(200)
    } catch (e) {
        if (e.code === "NOT_FOUND") return res.status(404).send("Pasta não encontrada")
        if (e.code === "NO_CHANGE") return res.status(304).send("não há alteração de texto")
        console.error(e)
        return res.sendStatus(500)
    }
}