import { Router } from "express"

// import {  } from "../controllers/"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const routes = Router() 
    .get("/folders/list", listFolders) // lista pastas existentes
    .get("/folders/content", contentFolder)    // lista conteúdo
    .post("/folders/new")  // cria nova pasta
    .put('/folders/name', ) 
    .put('/folders/note', ) 
    .patch('/folders/name-video', ) 
    .patch('/folders/delete-video', ) 
    .delete('/folders', ) 

const foldersRouter = Router()
foldersRouter.use('/folders', authMiddleware)

export default foldersRouter
