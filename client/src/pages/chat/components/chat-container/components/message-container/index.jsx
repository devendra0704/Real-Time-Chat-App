import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTES, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constant";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {MdFolderZip} from 'react-icons/md'
import {IoMdArrowRoundDown} from 'react-icons/io'
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


const MessageContainer = () => {
  const scrollRef =useRef();
  const {selectedChatType, selectedChatData,userInfo,selectedChatMessages,setSelectedChatMessages} = useAppStore();
  const [showImage,setShowImage] =useState(false);
  const [imageURL, setImageURL]= useState(null);


  useEffect(()=>{
    const getMessages =async()=>{
      try {
        const res = await apiClient.post(GET_ALL_MESSAGES_ROUTES,{id:selectedChatData._id},{withCredentials:true});
        // console.log(res.data.messages);

        if(res.data.messages){
          // console.log("check check 1 2 3...")
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const getChannelMessages = async()=>{
      try {
        const res = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, {withCredentials:true});
        // console.log(res.data);
        
        if(res.data.messages){
          setSelectedChatMessages(res.data.messages)
        }
      } catch (error) {
        console.log({error});
      }
    }

    if(selectedChatData._id){
      if(selectedChatType === "contact") getMessages();
      else if(selectedChatType === "channel") getChannelMessages();
    }
  },[selectedChatData,selectedChatType,setSelectedChatMessages])

  useEffect( ()=>{
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[selectedChatMessages])

  const checkImage = (filePath)=>{
    const imageRegex = 
    /\.(jpg|jpeg|png|gif|bnp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }


  const downloadFile = async (url) => {
    try {
        const res = await apiClient.get(url, { responseType: "blob" });

        // Create a Blob object and URL for downloading
        // Blob (Binary Large Object) is a data type used to represent a file-like object of immutable, raw data.
        const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
        
        // Create a link element
        const link = document.createElement("a");
        link.href = urlBlob;

        // Set the filename based on URL or a default name
        const filename = url.split("/").pop(); 
        link.setAttribute("download", filename);

        // Append link to the body and trigger click event to start download
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('An error occurred while downloading the file.');
    }
}



  const renderMessages =()=>{
    let lastDate=null;
    return selectedChatMessages.map((message,index)=>{
      const messageDate= moment(message.timeStamp).format("YYYY-MM-DD");
      // console.log(messageDate);
      const showDate=messageDate!==lastDate;
      lastDate=messageDate;
      return(
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      )
      // console.log(message);
    })
  }

 

  const renderDMMessage = (message)=> 
    // console.log(message.content);
    // console.log(selectedChatData._id);
    (
      <div className={`${message.sender === selectedChatData._id ? "text-left": "text-right"}`}>
        {/* {console.log(message)} */}
      {
        message.messageType==="text" && (
          <div className={`${message.sender!== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :"bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}
          </div>
        )
      }

      {
        message.messageType==="file" &&
          <div className={`${message.sender!== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :"bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[40%] break-words`}>
            {/* {console.log("url:--",message.fileUrl)} */}
            { checkImage (message.fileUrl) ? 
            ( <div className="cursor-pointer" 
              onClick={()=>{setShowImage(true);
                            setImageURL(message.fileUrl);
              }}
              >
              <img
              src={`${message.fileUrl}`}
              height={300}
              width={300}
              />
            </div>)
            :
            (<div className="flex items-center justify-center">
              <span className="text-white text-3xl bg-black/20 rounded-full p-3 ">
                <MdFolderZip/>
              </span>
              <span>
                {message.fileUrl.split("/").pop()}
              </span>
              <span className="bg-black/20 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown/>
              </span>
            </div>) 
            }
        </div>
      }
      <div className="text-xs text-gray-600">
        {/* {console.log(message.timeStamp)} */}
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  )


  const renderChannelMessage = (message)=>{
    const fileName = message.fileUrl ? message.fileUrl.split("/").pop() : "Unknown File";
    // console.log("aaaa");
    return (
      <div className={`mt-5 ${message.sender._id === userInfo.id ? "text-right": "text-left"}`}>
        {
          message.messageType==="text" && (
            <div className={`${message.sender._id=== userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :"bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 mt-4 max-w-[50%] break-words ml-5`}>
              {message.content}
            </div>
          )
        }
      {
        message.messageType==="file" &&
          <div className={`${message.sender._id=== userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :"bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[40%] break-words`}>
            {/* {console.log("url:--",message)} */}
            { checkImage (message.fileUrl) ? 
            ( <div className="cursor-pointer" 
              onClick={()=>{setShowImage(true);
                            setImageURL(message.fileUrl);
              }}
              >
              <img
              src={`${message.fileUrl}`}
              height={300}
              width={300}
              />
            </div>)
            :
            (<div className="flex items-center justify-center break-words max-w-full md:max-w-[250px]">
              <span className="text-white text-xl md:text-2xl bg-black/20 rounded-full p-1 md:p-2">
                <MdFolderZip />
              </span>
              <span className="text-sm md:text-sm overflow-hidden max-w-[150px] md:max-w-[200px] mx-1">
              {fileName}
              </span>
              <span className="bg-black/20 text-2xl md:text-3xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 p-1 md:p-1" onClick={() => downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown />
              </span>
            </div>
            )            
            }
        </div>
      }

        {
          message.sender._id!== userInfo.id ?
          (<div className="flex items-center justify-start gap-3 ">
            <Avatar className="w-5 h-5 rounded-full overflow-hidden ">
            {
            message.sender.image && (
              <AvatarImage
                src={message.sender.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              )}

            
              <AvatarFallback className="uppercase w-full h-full text-sm border-[1px] flex items-center justify-center rounded-full bg-[#827552]">
                {message.sender.firstName
                  ? message.sender.firstName.charAt(0).toUpperCase()
                  : message.sender.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60" > {message.sender.firstName} {message.sender.lastName}</span>
            <span className="text-xs text-white/60" > {moment(message.timeStamp).format("LT")}</span>
          </div>)
          :
          (<div className="text-xs text-white/60">
            {moment(message.timeStamp).format("LT")}
          </div>)
        }

      </div>
    )
  }

  
  
  return (
    <div className="flex-1 overflow-y-auto  sccrollbar-hidden  p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]  w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {
        showImage && 
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src= {imageURL} 
            className="h-[70vh] sm:h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-8">
            <button className="bg-black/20 text-4xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            onClick={()=>downloadFile(imageURL)}
            >
            <IoMdArrowRoundDown/>
            </button>
            <button className="bg-black/20 text-4xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            onClick={()=>{setShowImage(false)
              setImageURL(null);
            }}
            >
            <IoCloseSharp/>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer;