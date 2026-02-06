import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URL || "");
        console.log("DataBase Connected SuccessFully", dbConnection.connection.host);
        
    } catch (error) {
        console.log("DataBase Connection Failed", error)
        process.exit(1)
    }
}

export default connectDB