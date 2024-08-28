import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const dbconnect=()=>{
    const db_url=process.env.DATABASE_URL;
    
    mongoose.connect(db_url,{
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log('db connection is successful')
    })
    .catch((error)=>{
        console.log('issue in db connection')
        console.error(error.message);
        process.exit(1);
    })
}

export default dbconnect;