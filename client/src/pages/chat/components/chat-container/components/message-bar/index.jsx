import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constant";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react"
import {GrAttachment} from "react-icons/gr"
import { IoSend } from "react-icons/io5";
import {RiEmojiStickerLine} from "react-icons/ri"

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef=useRef();
  const socket = useSocket();
  const {selectedChatType, selectedChatData,userInfo} = useAppStore();
  const [message,setMessage] =useState("");
  const [emojiPickerOpen,setEmojiPickerOpen] =useState(false);

  useEffect (()=>{
    function handleClickOutside(event){
      if(emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiPickerOpen(false);
      };
    }
    document.addEventListener("mousedown",handleClickOutside);

    return()=>{
      document.removeEventListener("mousedown",handleClickOutside);
    }
  },[emojiRef]);

  const handleSetEmoji = ()=>{
    setEmojiPickerOpen(true);
  }

  const handleAddEmoji = (emoji)=>{
    setMessage((msg)=>msg+emoji.emoji);
  }

  const handleSendMessage = ()=>{
    // if(message!=""){
    if(selectedChatType==="contact"){
      socket.emit("sendMessage",{
        sender:userInfo.id,
        content:message,
        recipent:selectedChatData._id,
        messageType:"text",
        fileUrl:undefined,
  
      })
      // }
    }
    else if (selectedChatType==="channel"){
      console.log("channel...");
      socket.emit("send-channel-message",{
        sender:userInfo.id,
        content:message,
        messageType:"text",
        fileUrl:undefined,
        channelId:selectedChatData._id

      })
    }
    setMessage("");
  }

  const handleAttachmentClick = ()=>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async(event)=>{
    try {
      const file = event.target.files[0];
      // console.log({file});
      if(file){
        const formData = new FormData();
        formData.append("file",file);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE,formData,{withCredentials:true});

        // console.log(res.data);

        if(res.status===200 && res.data){
          if(selectedChatType === "contact"){
            socket.emit("sendMessage",{
              sender:userInfo.id,
              content:undefined,
              recipent:selectedChatData._id,
              messageType:"file",
              fileUrl:res.data.filePath,
      
            })
          }
          else if (selectedChatType==="channel"){
            socket.emit("send-channel-message",{
              sender:userInfo.id,
              content:undefined,
              messageType:"file",
              fileUrl:res.data.filePath,
              channelId:selectedChatData._id
      
            })
          }
        }
      }

    } catch (error) {
      console.log({error});
    }
  }

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-4 sm:px-8 mb-12  md:mb-6 sm:mb-6 gap-1 sm:gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-3 sm:gap-5 pr-2 sm:pr-5">
        <input
          type="text"
          className="flex-1 p-3 sm:p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-xl sm:text-2xl" />
        </button>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={handleSetEmoji}
          >
            <RiEmojiStickerLine className="text-xl sm:text-2xl" />
          </button>

          <div className="absolute bottom-12 right-[-70px] sm:right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-3 sm:p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-xl sm:text-2xl" />
      </button>
    </div>
  );
}

export default MessageBar;