export interface IReminder {
  id: number;
  actividadId: number;
  fechaEnvio?: string | null;
  enviado: boolean;
}
