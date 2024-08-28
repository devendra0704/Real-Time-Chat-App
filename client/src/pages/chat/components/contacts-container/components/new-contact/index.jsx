import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constant";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";

const NewContact = () => {
    const {setSelectedChatType,setSelectedChatData,selectedChatData} = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContact, setSearchedContact] = useState([]);

    const searchContacts = async (searchTerm) => {
        
        try {
            // console.log(searchTerm);
            if (searchTerm.length > 0) {
                
                const res = await apiClient.post(SEARCH_CONTACTS_ROUTES, {searchTerm }, { withCredentials: true })
                // console.log(res.data.contacts)
                if (res.status === 200 && res.data.contacts) {
                    setSearchedContact(res.data.contacts);
                }
                // console.log(searchedContact);
            }
            else {
                setSearchedContact([]);
            }
        } catch (error) {
            console.log({ error });
        }
    };

    const selectNewContact = (contact)=>{
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContact([]);
    }

    // console.log("dm ",selectedChatData);

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-lg text-purple-500 cursor-pointer hover:text-white mx-10"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white p-2 rounded">
                        Select new Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-full  max-w-lg p-6 rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Contacts"
                            className="rounded-lg p-4 bg-[#2c2e3b] w-full"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {
                        searchedContact.length>0 &&
                        <ScrollArea className="h-[250px] overflow-auto">
                        <div className="flex flex-col gap-5">
                            {
                                searchedContact.map((contact) => (
                                    <div key={contact._id} className="flex gap-3 items-center cursor-pointer"
                                    onClick={()=>selectNewContact(contact)} 
                                    >
                                        <div className="w-12 h-12 relative">
                                            <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                                {contact.image ? (
                                                    <AvatarImage
                                                        src={contact.image}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="uppercase w-full h-full text-lg border-[1px] flex items-center justify-center rounded-full bg-[#827552]">
                                                        {contact.firstName
                                                            ? contact.firstName.charAt(0).toUpperCase()
                                                            : contact.email.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>
                                                {contact.firstName
                                                    ? `${contact.firstName} ${contact.lastName}`
                                                    : contact.email}
                                            </span>
                                            <span className="text-xs">{contact.email}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        </ScrollArea>
                    }

                    {searchedContact.length <= 0 && (
                        <div className="flex-1 h-[210px] flex flex-col justify-center items-center mt-10">
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center text-3xl lg:text-4xl text-center">
                                <h3>Hi! Welcome to Chat</h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NewContact;
