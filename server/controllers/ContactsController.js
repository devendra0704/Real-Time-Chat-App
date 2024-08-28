import mongoose from "mongoose";
import User from "../models/userModel.js";
import Message from "../models/messagesModel.js";

export const searchContacts = async(req,res,next)=>{

    try {
        const {searchTerm} = req.body;
        if(searchTerm===undefined || searchTerm===null){
            return res.status(400).send("search term is required.")
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,"\\$&"
        );
 
        // this will create a regular expression /hello/i, which will match "Hello", "HELLO", "hello", etc
        const regex =new RegExp(sanitizedSearchTerm,"i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },  // Exclude the current user from the search results
                {
                    $or: [
                        { firstName: regex },   // Match the regex against the firstName field
                        { lastName: regex },    // Match the regex against the lastName field
                        { email: regex }        // Match the regex against the email field
                    ],
                },
            ],
        });
        
        return res.status(200).json({contacts});
    } catch (error) {
        console.log({error});
        return res.status(500).send("internal server problem"); 
    }
}




export const getContactsForDMList = async(req,res,next)=>{

    try {
        let {userId} = req;

        userId = new mongoose.Types.ObjectId(userId);

        // mongodb pipeline
        const contacts = await Message.aggregate([
            {
                $match:{
                    $or:[{sender:userId}, {recipent:userId}],
                },
            },
            {
                $sort:{timeStamp:-1}
            },
            {$group:{
                _id:{
                    $cond:{
                        if:{$eq:["$sender",userId]},
                        then:"$recipent",
                        else:"$sender",
                    }
                },lastMessageTime:{$first:"$timeStamp"}
            }},
            {$lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo",
            }},
            {
                $unwind:"$contactInfo",
            },
            {
                $project:{
                    _id:1,
                    lastMessageTime:1,
                    email:"$contactInfo.email",
                    firstName:"$contactInfo.firstName",
                    lastName:"$contactInfo.lastName",
                    image:"$contactInfo.image",
                }
            },
            {
                $sort:{lastMessageTime:-1}
            }
        ])

        // console.log(contacts);

        return res.status(200).json({contacts});
    } catch (error) {
        console.log({error});
        return res.status(500).send("internal server problem"); 
    }
}



export const getAllContacts = async(req,res,next)=>{

    try {
        const users = await User.find({_id:{$ne:req.userId}},
            "firstName lastName _id email"
        )

        const contacts = users.map((user)=>({
            label:user.firstName ? `${user.firstName} ${user.lastName}`: user.email,value:user._id,
        }))
        
        return res.status(200).json({contacts});
    } catch (error) {
        console.log({error});
        return res.status(500).send("internal server problem"); 
    }
}