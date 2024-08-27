import { Server as SocketIOServer } from "socket.io"
import Message from "./models/messagesModel.js";
import Channel from "./models/ChannelModel.js"


// create a new instance of a Socket.IO server (io) that is attached to the given HTTP server.
const setupSocket = (server) => {
    const io = new SocketIOServer(server,{
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    
// The line const userSocketMap = new Map(); initializes a new Map object in JavaScript. This Map is used to store key-value pairs, where in this context:

// Key: Represents the userId (a unique identifier for a user).
// Value: Represents the socket.id (a unique identifier for the user's WebSocket connection).

    const userSocketMap =new Map();



    const disconnect = (socket) =>{
        console.log(`client disconnected : ${socket.id}`);
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId===socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendMessage = async(message)=>{
        // get the socketId of sender and recipent
        const senderSocketId=userSocketMap.get(message.sender);
        const recipentSocketId =userSocketMap.get(message.recipent);

        // store message in database
        const createMessage = await Message.create(message);

        // 
        const messageData = await Message.findById(createMessage._id)
        .populate("sender","id email firstName lastName image")
        .populate("recipent","id email firstName lastName image")

        if(recipentSocketId){
            io.to(recipentSocketId).emit("recieveMessage",messageData)
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("recieveMessage",messageData)
        }
    }

    const sendChannelMessage = async(message)=>{
        const {channelId,sender,content,messageType,fileUrl}=message;
        // console.log(message);

        const createMessage = await Message.create({
            sender,
            recipent:null,
            content,
            messageType,
            timeStamp:new Date(),
            fileUrl,
        })

        const messageData =await Message.findById(createMessage._id)
        .populate("sender", "id email firstName lastName image")
        .exec()

        await Channel.findByIdAndUpdate(channelId,{
            $push : {messages:createMessage._id},
        });

        const channel = await Channel.findById(channelId).populate("members");

        const finalData={...messageData._doc, channelId:channel._id};
        
        // console.log(channel);
        if(channel && channel.members){
            // console.log("testing");

            channel.members.forEach((member)=>{
                const memberSocketId = userSocketMap.get(member._id.toString());
                // console.log("memberSocket",memberSocketId)
                if(memberSocketId){
                    io.to(memberSocketId).emit("recieve-channel-message",finalData);
                }
            });
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if(adminSocketId){
                io.to(adminSocketId).emit("recieve-channel-message",finalData);
            }
        }
    }


    // io.on is used to set up an event listener on the server side. This allows the server to respond to specific events that occur in real-time, such as when a client connects, disconnects, or sends a message.

    io.on("connection",(socket)=>{ 
        //sets up an event listener for the "connection" event, which is triggered whenever a new client successfully establishes a WebSocket connection with the server.
        const userId =socket.handshake.query.userId;
        // console.log("........",socket);

        if(userId){
            userSocketMap.set(userId,socket.id); 
            //allows the server to later identify which socket connection belongs to which user
            console.log(`userconnected ${userId} with socket Id: ${socket.id}`);
        }
        else{
            console.log("UserId not provided during connection.");
        }

        // This line listens for a "sendMessage" event from the client. When this event is triggered (likely when the client wants to send a chat message), the sendMessage function is called.
        socket.on("sendMessage",sendMessage);
        socket.on("send-channel-message",sendChannelMessage);
        // This line listens for the "disconnect" event, which is triggered when the client disconnects from the server.
        socket.on("disconnect",()=>disconnect(socket));
    });
}

export default setupSocket;