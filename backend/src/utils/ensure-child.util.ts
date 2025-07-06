import prisma from "../config/prisma.config";
import { MongoLogService } from "../services";
import { CustomError } from "./errors.util";

const logger = new MongoLogService();

export const checkIfChildBelongsToUser = async (userId:number, childId:number):Promise<boolean> => {
   try {
    const child = await prisma.ninos.findUnique({
        where: {
            id: childId,
        },
    });
    
    if (!child) {
        logger.logError("Child with id " + childId + " not found");
        return false;
    }

    const familia = await prisma.familia_usuarios.findFirst({
        where: {
            familia_id: child.familia_id,
            usuarios_id: userId,
        },
    });

    if (!familia) {
        logger.logError("Child with id " + childId + " not found");
        return false;
    }

    return true;
   } catch (error) {
    logger.logError("Error al verificar el niño");
    return false;
   }
}