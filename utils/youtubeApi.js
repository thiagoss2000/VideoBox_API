import { google } from "googleapis"

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YT_API_KEY
})

export async function searchYoutube(query, duration = "medium", maxResults = 25) {
    try {
        const res = await youtube.search.list({
        part: "snippet",
        q: query,
        type: "video",
        videoDuration: duration,
        maxResults
        })

        return res.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails
        }))
    } catch (err) {
        console.error("Erro na busca:", err.message)
        return []
    }
}
