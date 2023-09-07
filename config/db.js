import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected ${connect.connection.host}`)
    } catch (err) {
        console.log(`MongoDB Connection Error ${err}`)
    }
}

export default connectDB
