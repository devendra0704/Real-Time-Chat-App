import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFiles } from "../controllers/MessageController.js";
import multer from "multer";

const app=express();
const messagesRouter = express.Router();
// const upload = multer({dest:'uploads/files'})
const upload = multer({ storage: multer.memoryStorage() });

messagesRouter.post("/get-messages",verifyToken,getMessages);
messagesRouter.post("/upload-file",verifyToken,upload.single("file"),uploadFiles);

export default messagesRouter;

