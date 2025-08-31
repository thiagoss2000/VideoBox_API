import { Router } from "express"

import { postSignUp, postSignIn, deleteAccount } from "../controllers/loginController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const loginRouter = Router()

loginRouter.post("/sign-up", postSignUp)
loginRouter.post('/sign-in', postSignIn)
loginRouter.delete('/account', authMiddleware, deleteAccount)

export default loginRouter
