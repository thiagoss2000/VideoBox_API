import db from "../db.js"
import joi from "joi";

import { google } from "googleapis"

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YT_API_KEY // coloque sua chave no .env
})

async function searchYoutube(query, duration = "long", maxResults = 25) {
  try {

    const res = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      videoDuration: duration,
      maxResults
    })

    // retorna resultados simplificados
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

export async function searchVideos(req, res) {
    const { search } = req.query

    const authSchema = joi.string().required().min(1)
    const validation = authSchema.validate(search, { abortEarly: false })

    if (validation.error) {
        return res.status(422).send(validation.error.details.map((e) => e.message))
    }
    
    try {             
        const videos = await searchYoutube(search)
        return res.status(200).json(videos)
    } catch {
        return res.sendStatus(500)
    }
}

async function getRecommendations(userId) {
    try {             
          const preferences = await db.collection("preferences").findOne({user: userId})
          const themes = [...(preferences?.themeVideo || [])]
          const resultado = []

          let query = ""
          if (themes.length == 0)
              query = "video"
          else if (themes.length <= 3)
              query = themes.join(" | ")
          else {     // para listas com mais de 3 temas, selecionar 3 para busca por tema
              for (let i = 0; i < 3; i++) {
                  const index = Math.floor(Math.random() * themes.length)
                  resultado.push(themes[index])
                  themes.splice(index, 1) // remove do array para não repetir
              }
              query = resultado.join(" | ")
          }

          const recommendations = await searchYoutube(query)
          return recommendations
      } catch {
          return []
      }
}

export async function getTimeline(req, res) {
    const { userId, query } = req
    
    try {             // caso não exista lista de recomendações ou seja requisitado novos videos ?newList=true
        let recommendations = await db.collection("timeline").findOne({user: userId})
        if(!recommendations || query?.newList){
          const newRecommendations = await getRecommendations(userId)
          await db.collection("timeline").replaceOne({ user: userId }, { user: userId, recommendations: newRecommendations }, { upsert: true })
          recommendations = await db.collection("timeline").findOne({user: userId})
        }
        return res.status(200).json(recommendations)
    } catch {
        return res.sendStatus(500)
    }
}