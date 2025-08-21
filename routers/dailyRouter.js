import { Router } from "express"

import {  } from "../controllers/"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const routes = Router()
    .get("/", getDaily)
    .post('/', newDaily) 
    .delete('/', deleteDaily)

const dailyRouter = Router()
dailyRouter.use('/daily', authMiddleware, routes)

export default dailyRouter
