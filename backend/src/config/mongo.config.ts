import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:root_mongo_password@localhost:27017/nidodb_mongo?authSource=admin';

export const connectMongoDB = async () => {
  console.log('URI de MongoDB:', MONGODB_URI);
  try {

    console.log('Intentando conectar a MongoDB con URI:', MONGODB_URI.split('@')[1] ? `mongodb://[REDACTED_CREDENTIALS]@${MONGODB_URI.split('@')[1]}` : MONGODB_URI);

    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};