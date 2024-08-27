import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelController.js";

const app=express();
const channelRoutes=express.Router();

channelRoutes.post("/create-channel",verifyToken,createChannel);
channelRoutes.get("/get-user-channel",verifyToken,getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMessages);

export default channelRoutes;