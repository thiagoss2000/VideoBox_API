import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import loginRouter from "./routers/loginRouter.js"
import preferredRouter from "./routers/preferredRouter.js"

dotenv.config()

// create express
const app = express()
app.use(express.json())
app.use(cors())

// routes
app.use(loginRouter)
app.use(preferredRouter)

// port
const port = process.env.PORT
app.listen(port)
console.log(`Server port: ${port}`)
