import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8','1.1.1.1']);

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDB;