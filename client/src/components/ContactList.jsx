import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({contacts,isChannel=false}) => {
    const  {selectedChatData, setSelectedChatData, setSelectedChatType,selectedChatType,setSelectedChatMessages} = useAppStore();

    const handleclick = (contact) =>{
      if(isChannel) setSelectedChatType("channel");
      else setSelectedChatType("contact");
      
      setSelectedChatData(contact);

      if(selectedChatData && selectedChatData._id!==contact._id){
        setSelectedChatMessages([]);
      }
 
    }
  return (
    <div className=" mt-5 ">
      {contacts.map((contact)=>(
        <div key={contact._id} className={`pl-10 py-2 translate-all duration-100 cursor-pointer ${selectedChatData && selectedChatData._id===contact._id ?"bg-[#8417ff] hover:bg-[#8417ff]":"hover:bg-[#f1f1f111]"}`} onClick={()=> handleclick(contact)}>
          <div className="flex gap-5 items-center justify-start text-white">
            {
              !isChannel && (
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
            )
            }
            {
              isChannel && <div className="bg-[#ffffff22] h-10 w-10 border-[1px] flex items-center justify-center rounded-full" >### </div>
            }
            {
              isChannel ? <span>{contact.name} </span> : <span>{`${contact.firstName} ${contact.lastName}`} </span>
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContactList