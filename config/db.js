import { MongoClient } from "mongodb"
import { config } from "./env.js"

let client
let db

export async function connectDB() {
  if (!client) {
    client = new MongoClient(config.mongoUri)
    await client.connect()
    db = client.db(config.mongoDb)
  }
  return db
}

export function getDB() {
  if (!db) throw new Error("Database not connected")
  return db
}

export async function closeDB() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}
