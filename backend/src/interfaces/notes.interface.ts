import { Prisma } from "@prisma/client";

export interface INota {
  id: number;
  ninos_id: number;
  titulo: string;
  texto: string;
  fecha_creacion: Date;
}