import db from "../db.js"
import joi from "joi";

export async function createFolder(req, res) {
    const { body, userId } = req

    const authSchema = joi.object({
        name: joi.string().required().min(1)
    })

    const validation = authSchema.validate(body, { abortEarly: false })

    if (validation.error) {
        return res.status(422).send(validation.error.details.map((e) => e.message))
    }
    
    try {             
        await db.collection("folders").insertOne({user: userId, folderName: body.name})
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
