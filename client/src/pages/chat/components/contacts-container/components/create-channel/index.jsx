import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTES, GET_ALL_CONTACTS_ROUTES, SEARCH_CONTACTS_ROUTES } from "@/utils/constant";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
    const {setSelectedChatType,setSelectedChatData,selectedChatData,addChannel} = useAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);

    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts,setSelectedContacts]=useState([]);
    const [channelName,setChannelName]=useState("");

    useEffect(()=>{
        const getData= async()=>{
            const res= await apiClient.get(GET_ALL_CONTACTS_ROUTES,{withCredentials:true});
            setAllContacts(res.data.contacts);
        }
        getData();
    },[])

    const createChannel = async()=>{
        try {
            console.log("testing");
            if(channelName.length>0 && selectedContacts.length>0){  
                // console.log(selectedContacts);

                const res = await apiClient.post(CREATE_CHANNEL_ROUTES,{name:channelName,members:selectedContacts.map((contact)=>contact.value)},{withCredentials:true});

                if(res.status===201){
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(res.data.channel);
                }

            }
        } catch (error) {
            console.log({error});
        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-lg text-purple-500 cursor-pointer hover:text-white mx-10"
                            onClick={() => setNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white p-2 rounded">
                        Create New Group
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-full h-[400px] max-w-lg p-6 rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Please fill up details for new groups</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Group Name"
                            className="rounded-lg p-4 bg-[#2c2e3b] w-full"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                        className="rounded-lg bg-[#2c2e2b] border-none py-2 text-white"
                        defaultOptions={allContacts}
                        placeholder="search contacts"
                        value={selectedContacts}
                        onChange={setSelectedContacts}
                        emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600" >No result found</p>
                        }
                        />
                    </div>
                    <div>
                        <Button className="w-full bg-purple-700 hover:bg-purple-900 translate-all duration-300" onClick ={createChannel}>Create Group</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChannel;
