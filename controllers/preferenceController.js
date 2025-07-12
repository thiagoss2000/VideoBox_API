import db from "../db.js"
import joi from "joi";

export async function setPreference(req, res) {
    const { body, userId } = req

    const authSchema = joi.object({
        theme: joi.string().valid('light', 'dark'),
        language: joi.string().valid('pt-BR', 'en'),
        timeLimit: joi.number().integer().min(1).max(24),
    }).or('theme', 'language', 'timeLimit')

    const validation = authSchema.validate(body, { abortEarly: false })

    if (validation.error) {
        return res.status(422).send(validation.error.details.map((e) => e.message))
    }
    
    try {             
        await db.collection("preferences").updateOne({user: userId}, {$set: body}, { upsert: true })
        return res.sendStatus(200)
    } catch {
        return res.sendStatus(500)
    }
}

export async function getPreference(req, res) {
    const { userId } = req
    try {
        const preferences = await db.collection("preferences").findOne({user: userId})
        return res.status(200).send(preferences);
    } catch {
        return res.sendStatus(500)
    }
}