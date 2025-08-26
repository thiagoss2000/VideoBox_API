import express from "express"
import cors from "cors"

import { config } from "./config/env.js"
import { connectDB } from "./config/db.js"

import loginRouter from "./routers/loginRouter.js"
import preferredRouter from "./routers/preferredRouter.js"
import foldersRouter from "./routers/foldersRouter.js"
import timelineRouter from "./routers/timelineRouter.js"

const app = express()
app.use(express.json())
app.use(cors())

app.use(loginRouter)
app.use(preferredRouter)
app.use(foldersRouter)
app.use(timelineRouter)

// inicia servidor só se não for teste
if (config.nodeEnv !== "test") {
  connectDB().then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
    })
  }).catch(err => {
    console.error("Erro ao conectar ao banco:", err)
    process.exit(1)
  })
}

export default app
