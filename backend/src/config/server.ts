import dotenv from 'dotenv';
import mongoose from 'mongoose';


import prisma from "./prisma.config";
import app from "..";
import { connectMongoDB } from './mongo.config';

dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Inicia el servidor y las conexiones a las bases de datos de mySQL y MongoDB.
 * @function
 * @returns Una promesa que se resuelve cuando el servidor ha arrancado.
 */
export const startServer = async (): Promise<void> => {
  try {
    // --- Conexión a MySQL (Prisma) ---
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos MySQL (Prisma)');

    // --- Conexión a MongoDB (Mongoose) ---
    //await connectMongoDB(); 
    console.log('✅ Conectado a la base de datos MongoDB (Mongoose)');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor arrancado en el puerto: ${PORT}`);
    });

    // 📙 Manejo de señales de terminación
    // Ver documentación: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management
    // Ver documentación: https://mongoosejs.com/docs/connections.html
    const gracefulShutdown = async (signal: NodeJS.Signals) => {
      await prisma.$disconnect();
      console.log(`🔌 Prisma desconectado (${signal})`);
      // try {
      //   await mongoose.disconnect(); 
      //   console.log(`🔌 Mongoose desconectado (${signal})`);
      // } catch (mongoDisconnectError) {
      //   console.error('❌ Error al desconectar Mongoose:', mongoDisconnectError);
      // }
      process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Error al iniciar la app:', error);
    await prisma.$disconnect();
    // try {
    //   await mongoose.disconnect(); 
    // } catch (mongoError) {
    //   console.error('❌ Error al desconectar Mongoose en el inicio fallido:', mongoError);
    // }
    process.exit(1);
  }
};