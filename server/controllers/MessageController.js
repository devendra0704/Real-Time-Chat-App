import Message from "../models/messagesModel.js";
import {mkdirSync, rename, renameSync} from 'fs';
import path from 'path';
import { imagekit } from "../config/imgkit.js";
import { Readable } from 'stream';

export const getMessages = async(req,res)=>{

    try {
        const user1 = req.userId;
        const user2 = req.body.id;
        // console.log(req);

        if(!user1|| !user2){
            return res.status(400).send("both user IO's are required.")
        }

        const messages = await Message.find({
            $or:[
                {sender:user1 , recipent:user2},
                {sender:user2 , recipent:user1},
            ],
        }).sort({timeStamp:1});

        // console.log(messages);

        return res.status(200).json({messages});
    } catch (error) {
        console.log({error});
        return res.status(500).send("internal server problem"); 
    }
}

// export const uploadFiles = async(req,res)=>{

//     try {
//         if(!req.file){
//             return res.status(400).send("file is required");
//         }
//         const date =Date.now();
//         let fileDir = `uploads/files/${date}`;
//         let fileName= `${fileDir}/${req.file.originalname}`;
//         mkdirSync(fileDir,{recursive:true});
//         renameSync(req.file.path,fileName);
        
//         return res.status(200).json({filePath:fileName});
//     } catch (error) {
//         console.log({error});
//         return res.status(500).send("internal server problem"); 
//     }
// }



export const uploadFiles = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required");
        }
         // Create a readable stream from the file buffer
        const uploadStream = new Readable();
        uploadStream.push(req.file.buffer);
        uploadStream.push(null);

        // ImageKit upload parameters
        const uploadParams = {
            file: uploadStream,
            fileName: req.file.originalname,
        };


        // Upload file to ImageKit
        imagekit.upload(uploadParams, (error, result) => {
            if (error) {
                console.error('Error uploading file to ImageKit:', error);
                return res.status(500).send('Error uploading file to ImageKit.');
            }

            // Return the URL of the uploaded file
            return res.status(200).json({ filePath: result.url });
        });


        // const date = Date.now();
        // const fileDir = path.join('uploads', 'files', `${date}`);
        // const fileName = path.join(fileDir, req.file.originalname);
        // mkdirSync(fileDir, { recursive: true });
        // renameSync(req.file.path, fileName);

        // Return the file path with forward slashes
        // return res.status(200).json({ filePath: fileName.replace(/\\/g, '/') });
        
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server problem");
    }
}

