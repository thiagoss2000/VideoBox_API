import { Router } from "express"

import { getPreference, setPreference } from "../controllers/preferenceController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const preferredRouter = Router()

preferredRouter.use('/preference', authMiddleware);

preferredRouter.get("/preference", getPreference)
preferredRouter.post('/preference', setPreference)

export default preferredRouter
