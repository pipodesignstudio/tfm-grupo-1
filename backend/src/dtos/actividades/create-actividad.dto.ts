export class CreateActividadDto {
  titulo?: string | null;
  descripcion?: string | null;
  fechas_realizacion?: Date | null;
  dia_semana?: number | null; // 0-6 (Domingo-Sábado)
  hora_inicio?: Date | null;
  hora_fin?: Date | null;
  color?: string | null; // Color en formato hexadecimal
  ubicacion?: JSON | null; // Ubicación en formato JSON
  usuario_responsable?: number | null; // ID del usuario responsable
  rutina_id?: number | null; // ID de la rutina asociada, puede ser nulo
  completado?: boolean; // Indica si la actividad está completada
}