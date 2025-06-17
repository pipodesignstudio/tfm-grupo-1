import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nidodb_mongo';

export const connectMongoDB = async () => {
  try {
        console.log('Intentando conectar a MongoDB con URI:', MONGODB_URI.split('@')[1] ? `mongodb://[REDACTED_CREDENTIALS]@${MONGODB_URI.split('@')[1]}` : MONGODB_URI);

    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1); 
  }
};