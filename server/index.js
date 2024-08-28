import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dbconnect from './config/db.js'
import router from './routes/AuthRoutes.js'

import contactsRoutes from './routes/ContactRoutes.js'
import setupSocket from './socket.js'
import messagesRouter from './routes/MessagesRoutes.js'
import channelRoutes from './routes/ChannelRoutes.js'

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import path from 'path';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);



dotenv.config();
const app=express();
const port=process.env.PORT;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}))


// Serve static files from the React frontend app

// const buildPath = path.join(__dirname, '../client/dist');
// app.use(express.static(buildPath));



// app.use("/uploads/files",express.static("/uploads/files"));

// const uploadsDir = path.join(process.cwd(), 'uploads', 'files');
// app.use('/uploads/files', express.static(uploadsDir));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',router);
app.use('/api/contacts',contactsRoutes);
app.use('/api/messages',messagesRouter);
app.use('/api/channel',channelRoutes);

// console.log(path.join(buildPath, 'index.html'));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

const server= app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})

setupSocket(server);
dbconnect(); 