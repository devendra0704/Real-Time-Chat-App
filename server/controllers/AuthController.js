import { compare } from "bcrypt";
import User from "../models/userModel.js";
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";

dotenv.config();

const maxAge=3*24*60*60*1000;
const token=(email,userId)=>{
    const token= jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
    return token;
};

export const signup = async (req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("email and password required")
        }

        const user= await User.create({email,password});

        const options={
            maxAge,
            secure:true,
            sameSite:"None",
        }

        res.cookie("jwt",token(email,user.id),options);


        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup
            }
        })

    } catch (error) {
        console.log({error})
        return res.status(500).json({
            success:false,
            message:'internal server error'
        })
    }
}

export const login = async (req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("email and password required")
        }

        const user= await User.findOne({email});

        if(!user){
            return res.status(404).send("user with given is not found")
        }

        const auth =await compare(password,user.password);

        if(!auth){
            return res.status(400).send("password is incorrect");
        }

        const options={
            maxAge,
            secure:true,
            sameSite:"None",
        }

        res.cookie("jwt",token(email,user.id),options);

        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
            }
        })

    } catch (error) {
        console.log({error})
        return res.status(500).json({
            success:false,
            message:'internal server error'
        })
    }
}
export const getUserInfo = async (req,res,next)=>{
    try {
        const userData = await User.findById(req.userId);

        if(!userData){
            return res.status(404).send("user with the given id not found");
        }
        return res.status(200).json({
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
        })

    } catch (error) {
        console.log({error})
        return res.status(500).json({
            success:false,
            message:'internal server error'
        })
    }
}

export const updateProfile = async (req,res,next)=>{
    try {
        const {userId} =req;
        const {firstName,lastName}=req.body;


        if(!firstName || !lastName){
            return res.status(400).send("FirstName and LastName required.");
        }

        const userData = await User.findByIdAndUpdate(userId,{
            firstName,lastName,profileSetup:true
        },
        {new:true, runValidators:true});


        return res.status(200).json({
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
        })

    } catch (error) {
        console.log({error})
        return res.status(500).json({
            success:false,
            message:'internal server error'
        })
    }
}

export const logout = async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"});

        return res.status(200).send("Logout succesfully");
    } catch (error) {
        console.log({error});
        return res.status(500).send("problem in logout"); 
    }
}


