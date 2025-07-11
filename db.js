import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

let db
const client = new MongoClient(process.env.MONGO_URI)

try {
  await client.connect()
  db = client.db(process.env.MONGO_DB)
  console.log("database is running")
} catch (e) {
  console.log("error", e)
}

export default db
