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
export default app

if (process.env.NODE_ENV !== "test") {
    const port = process.env.PORT || 5000
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}
