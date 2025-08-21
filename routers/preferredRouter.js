import { Router } from "express"

import { getPreferences, setAmbientPreference, setSearchPreference } from "../controllers/preferenceController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const routes = Router()
    .get("/", getPreferences)
    .patch('/ambient', setAmbientPreference) // preferencia de ambiente
    .patch('/search', setSearchPreference) // preferencia de busca {theme, block}

const preferredRouter = Router()
preferredRouter.use('/preference', authMiddleware, routes)

export default preferredRouter
