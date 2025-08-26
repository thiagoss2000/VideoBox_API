import dotenv from "dotenv"

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env"

dotenv.config({ path: envFile })

export const config = {
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
  mongoDb: process.env.MONGO_DB,
  port: process.env.PORT || 4000,
  ytApiKey: process.env.YT_API_KEY,
}