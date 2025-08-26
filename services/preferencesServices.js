import * as preferenceRepository from "../repositories/preferenceRepository.js"

export async function setAmbientPreference(userId, preferenceData) {
  return preferenceRepository.updateByUser(userId, preferenceData)
}

export async function setBasicPreference(userId) {
    const basicPreference = {
        theme: 'dark',
        language: 'pt-BR',
        timeLimit: 1440, // tempo em minutos
        channelBlock: [],
        themeVideo: []
    }
    return preferenceRepository.updateByUser(userId, basicPreference)
}

export async function setSearchPreference(userId, body) {
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

    if (update.add) {
        await preferenceRepository.addToSet(userId, update.add)
    }

    if (update.pull) {
        await preferenceRepository.pull(userId, update.pull)
    }
}

export async function getPreferences(userId) {
    return preferenceRepository.findByUser(userId)
}