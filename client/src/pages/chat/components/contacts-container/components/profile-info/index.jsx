import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import apiClient from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constant";

const ProfileInfo = () => {
  const [image, setImage] = useState(null);
  const { userInfo,setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logout = async()=>{
    try {
      const res=await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});

      if(res.status===200){
        navigate("/auth");
        setUserInfo(null);
      }
      
    } catch (error) {
      console.log({error});
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between w-full bg-[#2a2b33] px-6 sm:px-10">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 relative">
          <Avatar className="w-12 h-12 rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="uppercase w-full h-full text-lg border-[1px] flex items-center justify-center rounded-full bg-[#827552]">
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0).toUpperCase()
                  : userInfo.email.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-white cursor-pointer" onClick={() => navigate("/profile")}>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : "dev"}
        </div>
      </div>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-2xl">
              <IoPowerSharp
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className=" bg-[#1c1b1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    </div>
  );
};

export default ProfileInfo;
