
import mongoose from "mongoose";


const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}`)
        // console.log("Database connected with connection instance: ", connectionInstance)
    }
    catch(error){
        console.log("Database connection error: ", error.message)
    }
}

export default connectDB