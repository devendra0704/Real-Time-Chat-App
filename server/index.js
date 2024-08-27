import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dbconnect from './config/db.js'
import router from './routes/AuthRoutes.js'
// import path from 'path'
import contactsRoutes from './routes/ContactRoutes.js'
import setupSocket from './socket.js'
import messagesRouter from './routes/MessagesRoutes.js'
import channelRoutes from './routes/ChannelRoutes.js'

dotenv.config();
const app=express();
const port=process.env.PORT||4000;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}))

// app.use("/uploads/files",express.static("/uploads/files"));

// const uploadsDir = path.join(process.cwd(), 'uploads', 'files');
// app.use('/uploads/files', express.static(uploadsDir));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',router);
app.use('/api/contacts',contactsRoutes);
app.use('/api/messages',messagesRouter);
app.use('/api/channel',channelRoutes);

const server= app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})

setupSocket(server);
dbconnect(); 