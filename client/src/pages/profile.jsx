import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import {useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {FaPlus,FaTrash} from "react-icons/fa"
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constant";

const Profile =()=>{
    const navigate=useNavigate();
    const {userInfo,setUserInfo} =useAppStore();
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [image,setImage]=useState(null);
    const [hovered,setHovered]=useState(false);
    // const fileInputRef = useRef(null);

    useEffect(()=>{
        if(userInfo.profileSetup){
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
        }
    },[userInfo])


    const validateProfile = ()=>{
        if(!firstName){
            toast.error("FirstName is required");
            return false;
        }
        if(!lastName){
            toast.error("Lastname is required.");
            return false;
        }
        return true;
    }

    const saveChanges = async () => {
        if(validateProfile()){
            try {
                const res = await apiClient.post(UPDATE_PROFILE_ROUTE, {firstName,lastName}, { withCredentials: true });
    
                if (res.status === 200 && res.data) {
                    setUserInfo({ ...res.data });
                    toast.success("Profile updated successfully.");
                    navigate("/chat");
                } else {
                    toast.error("Failed to update profile. Please try again.");
                }

            } catch (error) {
                console.error("Error updating profile:", error);
                toast.error("An error occurred while updating the profile.");
            }
        }
      };

      const handleNavigate=()=>{
        if(userInfo.profileSetup){
            navigate("/chat");

        }
        else{
            toast.error("please setup profile");
        }
      }
      
    //   const handleFileInputClick = ()=>{
    //     fileInputRef.current.click();
    //   }
    
    //   const handleDeleteImage = async() => {
    //     setImage(null);
    //   };

    //   const handleImageChange = async (e) => {
    //     const file= e.target.files[0];
    //     if ( file ) {
    //       const formData = new FormData();
    //       formData.append("profile-image",file);

    //       const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});

    //       if(res.status===200 && res.data.image){
    //         setUserInfo({...userInfo,image:res.data.image});
    //         toast.success("Image updated succesfully.")
    //       }

    //       const reader =new FileReader();
    //       reader.onload =()=>{
    //         setImage(reader.result);
    //       };
    //       reader.readAsDataURL(file);
    //     }
    //   };

    
      return (
        <div className="flex justify-center min-h-screen bg-[#59763ea3] ">
          <div className="max-w-md w-full h-full p-4 sm:p-6 md:p-8 bg-[#4444] rounded-lg shadow-md my-10">
            <div className="flex items-center">
              <IoArrowBack 
                className="text-2xl cursor-pointer hover:text-gray-600 transition-colors" 
                onClick={handleNavigate}
              />
            </div>
    
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                  {image ? (
                    <AvatarImage src={image} alt="Profile" className="h-32 w-32 md:w-42 md:h-42 text-7xl border-[1px] flex items-center justify-center rounded-full object-cover" />
                  ) : (
                    <div className={`uppercase h-32 w-32 md:w-42 md:h-42 text-7xl border-[1px] flex items-center justify-center rounded-full bg-[#827552]`}>
                      {firstName
                        ? firstName.charAt(0).toUpperCase()
                        : userInfo.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>
                {hovered && (
                  <div 
                //   onClick={image ? handleDeleteImage : handleFileInputClick}
                   className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      {image ? (
                        <FaTrash className="text-white cursor-pointer text-xl" />
                      ) : (
                        <FaPlus className="text-white text-xl cursor-pointer" />
                      )}
                  </div>
                )}
                    {/* <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={ handleImageChange}
                      className="hidden"
                      name="profile-image"
                    /> */}
              </div>
    
              <div className="w-full space-y-4">
                <Input
                  placeholder="Email"
                  type="email"
                  disabled
                  value={userInfo.email}
                  className="w-full "
                />
                <Input
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
    
            <Button 
              onClick={saveChanges}
              className="w-full py-2 text-lg font-semibold transition-colors my-5"
            >
              Save Changes
            </Button>
          </div>
        </div>
      );
    };
    
    export default Profile;