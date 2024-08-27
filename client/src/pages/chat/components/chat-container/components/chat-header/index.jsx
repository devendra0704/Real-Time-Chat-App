import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { RiCloseFill } from 'react-icons/ri'
const ChatHeader = () => {
  const { closeChat,selectedChatData,selectedChatType } = useAppStore();

  return (
    <div className="flex items-center h-[10vh] border-b-2 border-[#2f303b] justify-between px-10">
      <div className=" flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          {
            selectedChatType==="contact" ?
            <Avatar className="w-12 h-12 rounded-full overflow-hidden">
            {
            selectedChatData.image ? (
              <AvatarImage
                src={selectedChatData.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : 
            (
              <div className="uppercase w-full h-full text-lg border-[1px] flex items-center justify-center rounded-full bg-[#827552]">
                {selectedChatData.firstName
                  ? selectedChatData.firstName.charAt(0).toUpperCase()
                  : selectedChatData.email.charAt(0).toUpperCase()}
              </div>
            )}
            </Avatar>
            :
            (
              <div className="bg-[#ffffff22] h-10 w-10 border-[1px] flex items-center justify-center rounded-full" >##</div>
            )
          }

        </div>
        <div>
          {
            selectedChatType==="channel"&&
            selectedChatData.name
          }
          {
            selectedChatType==="contact" &&
            selectedChatData.firstName ?
            `${selectedChatData.firstName} ${selectedChatData.lastName}`
            : selectedChatData.email
          }
        </div>
      </div>
      <div className="flex items-center justify-center gap-5">
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={closeChat} >
          <RiCloseFill className='text-3xl' />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader;