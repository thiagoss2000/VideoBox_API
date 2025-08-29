import { Router } from "express"

import { addFolderNote, addVideo, createFolder, deleteFolder, 
    deleteFolderNote, deleteVideo, editFolderDays, editFolderName, 
    editFolderNote, editFolderNotes, editTagVideo, getFolders } from "../controllers/folderController.js"
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
    .patch("/days", editFolderDays)
    .patch("/notes/new", addFolderNote)
    .patch("/notes/edit", editFolderNote)
    .patch("/notes/delete", deleteFolderNote)

const foldersRouter = Router()
foldersRouter.use('/folders', authMiddleware, routes)

export default foldersRouter
