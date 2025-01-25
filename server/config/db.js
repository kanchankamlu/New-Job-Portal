import mongoose from "mongoose"

// Function to connect to the Mongodb database

const connectDB = async  () => {

    mongoose.connection.on('connected',() => console.log('Database Connected') )

    await mongoose.connect(`${process.env.MONGODB_URI}/job-Portal`)
}

export default connectDB