import db from "../db.js"
import joi from "joi";

export async function setAmbientPreference(req, res) {
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

export async function setSearchPreference(req, res) {
    const { body, userId } = req

    const authSchema = joi.object({
        add: joi.object()
            .pattern(
            joi.string().valid('channelBlock', 'themeVideo'),
            joi.array().items(joi.string().min(1)) // valor deve ser array de strings não vazias
            )
            .min(1)
            .optional(),

        remove: joi.object()
            .pattern(
            joi.string().valid('channelBlock', 'themeVideo'),
            joi.array().items(joi.string().min(1))
            )
            .min(1)
            .optional()
    }).or("add", "remove") // pelo menos um dos dois deve existir

    const validation = authSchema.validate(body, { abortEarly: false })
    if (validation.error) {
        return res.status(422).send(validation.error.details.map((e) => e.message))
    }
    
    const update = {}

    if (body.add) {
        update.add = {}
        for (const [field, values] of Object.entries(body.add)) {
        update.add[field] = { $each: values }
        }
    }

    if (body.remove) {
        update.pull = {}
        for (const [field, values] of Object.entries(body.remove)) {
        update.pull[field] = { $in: values }
        }
    }
        // adiciona e/ou remove lista de channelBlock e/ou themeVideo
    try {             
        if(update.add)
            await db.collection("preferences").updateOne({user: userId}, {$addToSet: update.add}, { upsert: true })    
        if(update.pull)
            await db.collection("preferences").updateOne({user: userId}, {$pull: update.pull})    
        return res.sendStatus(200)
    } catch {
        return res.sendStatus(500)
    }
}

export async function getPreferences(req, res) {
    const { userId } = req
    try {
        const preferences = await db.collection("preferences").findOne({user: userId})
        return res.status(200).send(preferences);
    } catch {
        return res.sendStatus(500)
    }
}