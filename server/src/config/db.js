import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongoose connected: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error(error.message)
        process.exit(1);
    }
}

export default connectDB