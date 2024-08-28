import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {toast} from "sonner" 
import apiClient from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {
  const navigate=useNavigate();
  const {setUserInfo} =useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateLogin = ()=>{
    if(!email.length){
      toast.error("Email is required.")
      return false;
    }
    if(!password.length){
      toast.error("Password is required.")
      return false;
    }
    return true;

  }

  const validateSignup = ()=>{ 
    if(!email.length){
      toast.error("Email is required.")
      return false;
    }
    if(!password.length){
      toast.error("Password is required.")
      return false;
    }
    if(password!==confirmPassword){
      toast.error("Password and confirm password should be same.")
      return false;
    }
    return true;
  }

  const handleLogin =async()=>{
    try {
      if(validateLogin()){
        const res= await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
  
        if(res.data.user.id){
          setUserInfo(res.data.user); 
          if(res.data.user.profileSetup){
            navigate("/chat");
          }
          else{
            navigate("/profile");
          }
        }
      }  
    } catch (error) {
      if(!error.response.data.success){
        if(error.response.data.message==="User not found"){
          toast.error("User not found");
        }
        else if(error.response.data.message==="Password is incorrect"){
          toast.error("Password is incorrect");
        }
        else{
          console.error({error});
        }
      }
      else{
        console.error({error});
      }
    }
  }

  const handleSignup =async()=>{
    if(validateSignup()){
      const res =await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true});

      if(res.status===201){
        setUserInfo(res.data.user);
        navigate("/profile");
      }
      // console.log({res});
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to Our App</h2>
          <p className="text-gray-600 mt-2">Sign in to your account or create a new one to get started.</p>
        </div>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" 
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            
            <Button onClick={handleLogin} className="w-full">Sign In</Button>
          </TabsContent>
        
          <TabsContent value="signup" className="space-y-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <Button onClick={handleSignup} className="w-full">Sign Up</Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
