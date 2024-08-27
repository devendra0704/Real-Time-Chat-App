export const createChatSlice = (set , get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],
    directMessagesContacts:[],
    channels:[],
    setChannels:(channels)=>set({channels}),
    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setSelectedChatData:(selectedChatData)=>set({selectedChatData}),
    setSelectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
    setDirectMessagesContacts:(directMessagesContacts)=>set({directMessagesContacts}),

    addChannel:(channel)=>{
        const channels = get().channels;
        set({channels: [channel,...channels]})
    },
    closeChat:()=>set({
        selectedChatType:undefined,
        selectedChatData:undefined,
        selectedChatMessages:[]
    }),
    addMessage : (message)=>{
        const selectedChatMessages=get().selectedChatMessages;
        const selectedChatType=get().selectedChatType;

        set({
            selectedChatMessages:[
                ...selectedChatMessages,{
                    ...message,
                    recipent:
                    selectedChatType==="channel"
                    ?message.recipent
                    :message.recipent._id,
                    sender:
                    selectedChatType==="channel"
                    ?message.sender
                    :message.sender._id
                }
            ]
        })
    },
    // addChannelInChannelList:(message)=>{
    //     const channels = get().channels;
    //     const data= channels.find((channel)=>channel._id===message.channelId);
    //     const index = channels.findIndex((channel)=>channel._id===message.channelId);
        
    //     // console.log("1....",index,"2...",data,"3...",channels);

    //     if(index !==-1 && index !==undefined){
    //         channels.splice(index,1);
    //         channels.unshift(data);
    //     }
    // }
});