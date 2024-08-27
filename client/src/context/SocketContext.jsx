import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () =>{
    return useContext(SocketContext);
};

export const SocketProvider = ({children})=>{
    const socket =useRef();
    const {userInfo} = useAppStore();

    useEffect(()=>{
        if(userInfo){
            socket.current = io(HOST,{
                withCredentials:true,
                query:{userId:userInfo.id},
            });
            // console.log("after",socket);

            socket.current.on("connect",()=>{
                console.log("connected to socket server");
            });

            const handleReceiveMessage = (message)=>{
                const {selectedChatData, selectedChatType ,addMessage} =useAppStore.getState();

                if(selectedChatType!==undefined &&
                (selectedChatData._id === message.sender._id ||
                selectedChatData._id===message.recipent._id)){
                    // console.log("rcv:",message);
                    addMessage(message);
                }

            }

            const handleReceiveChannelMessage = (message)=>{
                const {selectedChatData, selectedChatType ,addMessage,addChannelInChannelList} =useAppStore.getState();

                // console.log("hhhhhhhhhh",message);

                if(selectedChatType!==undefined &&
                (selectedChatData._id === message.channelId)){
                    // console.log("rcv:",message);
                    addMessage(message);
                }
                // addChannelInChannelList(message);

            }

            socket.current.on("recieveMessage",handleReceiveMessage)
            socket.current.on("recieve-channel-message",handleReceiveChannelMessage)

            
            return ()=>{
                socket.current.disconnect();
            }
        }
    },[userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}