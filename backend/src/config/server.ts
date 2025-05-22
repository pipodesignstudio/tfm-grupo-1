import app from "..";
import prisma from "./prisma.config";


const PORT = process.env.PORT || 3000;

/**
 * Inicia el servidor y la conexion a la base de datos.
 * @function
 * @returns Una promesa que se resuelve cuando el servidor ha arrancado.
 */

export const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor arrancado en el puerto: ${PORT}`);
    });

    // Manejo de señales de terminación según documentación
    // Ver https://www.prisma.io/docs/getting-started/quickstart-sqlite
    const gracefulShutdown = async (signal: NodeJS.Signals) => {
      await prisma.$disconnect();
      console.log(`🔌 Prisma desconectado (${signal})`);
      process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Error al iniciar la app:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};