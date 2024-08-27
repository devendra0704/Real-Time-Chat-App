import { useEffect } from "react";
import NewContact from "./components/new-contact";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNEL_ROUTES } from "@/utils/constant";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel";

const ContactContainer = () => {
  const {setDirectMessagesContacts,directMessagesContacts,selectedChatMessages,channels,setChannels} = useAppStore();

  useEffect(()=>{
    const getContacts = async()=>{
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTES,{withCredentials:true});
      if(res.data.contacts){
        setDirectMessagesContacts(res.data.contacts);
        // console.log(res.data.contacts);
      }
    }

    const getChannels = async()=>{
      const res= await apiClient.get(GET_USER_CHANNEL_ROUTES,{withCredentials:true});

      // console.log(res.data);

      if(res.data.channels){
        setChannels(res.data.channels);
      }
    }
    // console.log("123333");
    getChannels();
    getContacts();
  },[selectedChatMessages,setChannels,setDirectMessagesContacts])

    return (
      <div className="relative md:w-[35vw] xl:w-[20vw] lg:w-[30vw] w-full bg-[#0f0f1d] border-r-2 border-[#00080f]">
        <div className="text-2xl p-2 text-purple-500 border-b-2 font-bold">
          Chat-App
        </div>
        <div className="p-2">
          <div className="text-xl pl-4 mb-2 flex items-center justify-between">
            <span className="mx-6" >Contacts</span>
            <NewContact />
          </div>
          <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
            <ContactList contacts={directMessagesContacts} />
          </div>
        </div>
        <div>
          <div className="text-xl pl-4 mt-6 mb-2 flex items-center justify-between">
            <span className="mx-6" >Groups</span>
            <CreateChannel/>
          </div>
          <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
            <ContactList contacts={channels}  isChannel={true}/>
          </div>
        </div>
        <ProfileInfo />
      </div>
    );
  };
  export default ContactContainer;
  