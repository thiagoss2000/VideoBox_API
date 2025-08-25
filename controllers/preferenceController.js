import joi from "joi";
import * as preferenceService from "../services/preferencesServices.js"

export async function setAmbientPreference(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        theme: joi.string().valid("light", "dark"),
        language: joi.string().valid("pt-BR", "en"),
        timeLimit: joi.number().integer().min(1).max(1440),
    }).or("theme", "language", "timeLimit")

    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error) {
        return res.status(422).send(validation.error.details.map((e) => e.message))
    }

    try {
        await preferenceService.setAmbientPreference(userId, body)
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }
}
export async function setSearchPreference(req, res) {
    const { body, userId } = req

    const schema = joi.object({
        add: joi.object()
        .pattern(
            joi.string().valid("channelBlock", "themeVideo"),
            joi.array().items(joi.string().min(1))
        )
        .min(1)
        .optional(),

        remove: joi.object()
        .pattern(
            joi.string().valid("channelBlock", "themeVideo"),
            joi.array().items(joi.string().min(1))
        )
        .min(1)
        .optional()
    }).or("add", "remove")

    const validation = schema.validate(body, { abortEarly: false })
    if (validation.error) {
        return res.status(422).send(validation.error.details.map((e) => e.message))
    }

    try {
        await preferenceService.setSearchPreference(userId, body)
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }
}

export async function getPreferences(req, res) {
    const { userId } = req

    try {
        const preferences = await preferenceService.getPreferences(userId)
        return res.status(200).send(preferences)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }
}
