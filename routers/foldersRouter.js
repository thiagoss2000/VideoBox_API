import { Router } from "express"

import { addVideo, createFolder, deleteFolder, deleteVideo, editFolderName, editFolderNotes, editTagVideo, getFolders } from "../controllers/folderController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const routes = Router() 
    .get("/list", getFolders) // lista pastas existentes
    .post("/new", createFolder)  // cria nova pasta
    .delete("/rem", deleteFolder)  // deleta pasta
    .patch('/name', editFolderName) // editar nome de pasta
    .patch('/note', editFolderNotes) // editar texto da pasta ##
    .patch('/video/tag', editTagVideo) 
    .post("/video", addVideo) 
    .delete('/video', deleteVideo) 

const foldersRouter = Router()
foldersRouter.use('/folders', authMiddleware, routes)

export default foldersRouter
