import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI+"/"+DB_NAME,);
        console.log("\nMonogo DB connected!! DB Host:",connectionInstance.connection.host)
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}
export default connectDB;