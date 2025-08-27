import * as timelineRepository from "../repositories/timelineRepository.js"
import * as preferenceRepository from "../repositories/preferenceRepository.js"
import { searchYoutube } from "../utils/youtubeApi.js"

export async function searchVideos(userId, query) {
    const videos = await searchYoutube(query)
    await timelineRepository.replaceTimeline(userId, { searchVideos: videos })
    return videos
}

async function getRecommendations(userId) {
    const preferences = await preferenceRepository.findByUser(userId)
    const themes = [...(preferences?.themeVideo || [])]
    const channelBlock = [...(preferences?.channelBlock || [])]
    const resultado = []

    let searchQuery = ""
    if (themes.length === 0) {
        searchQuery = "video" // pesquisa padrão
    } else if (themes.length <= 3) {
        searchQuery = themes.join(" | ")
    } else {
        // escolhe 3 temas aleatórios
        for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * themes.length)
        resultado.push(themes[index])
        themes.splice(index, 1)
        }
        searchQuery = resultado.join(" | ")
    }

    const recommendations = await searchYoutube(searchQuery)

    // remove canais bloqueados
    return recommendations.filter(video => !channelBlock.includes(video.channelTitle))
}

export async function getTimeline(userId, newList = false) {
    let recommendations = await timelineRepository.findByUser(userId)

    if (!recommendations || newList) {
        const newRecommendations = await getRecommendations(userId)
        await timelineRepository.replaceTimeline(userId, { searchVideos: newRecommendations })
        recommendations = await timelineRepository.findByUser(userId)
    }

    return recommendations
}