import { Router } from "express"

import { createFolder, getFolders } from "../controllers/folderController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const routes = Router() 
    .get("/list", getFolders) // lista pastas existentes
    // .get("/folders/content", contentFolder)    // lista conteúdo
    .post("/new", createFolder)  // cria nova pasta
    // .put('/folders/name', ) 
    // .put('/folders/note', ) 
    // .patch('/folders/name-video', ) 
    // .patch('/folders/delete-video', ) 
    // .delete('/folders', ) 

const foldersRouter = Router()
foldersRouter.use('/folders', authMiddleware, routes)

export default foldersRouter
