import { Router } from "express"

import { authMiddleware } from "../middlewares/authMiddleware.js"
import { getTimeline, searchVideos } from "../controllers/timelineController.js"

const routes = Router() 
    .get("/search", searchVideos) 
    .get("/", getTimeline) 

const timelineRouter = Router()
timelineRouter.use('/timeline', authMiddleware, routes)

export default timelineRouter