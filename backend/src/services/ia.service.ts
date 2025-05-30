import dotenv from "dotenv";
import { IActividad, IActividadSuggestion } from "../interfaces/actividad.interface";
import { GoogleGenAI } from "@google/genai";
import { InternalServerError } from "../utils";

dotenv.config();

const _apiKey = process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({
  apiKey: _apiKey,
});


export class IAService {
  private systemPromt = `
    Given an array of 'IActividadSuggestion' objects, your task is to suggest new activities based on their content.
    You MUST return an array of exactly 3 'IActividad' objects.
    Each object in the returned array MUST strictly adhere to the 'IActividad' interface definition provided below.
    Ensure all fields are correctly typed, and nullable fields are set to 'null' if no value is applicable.
    Do NOT include any additional text or formatting outside of the JSON array.

    IActividadSuggestion interface definition:
    {
      titulo: string;
      descripcion: string;
      dia_semana: number;
      hora_inicio: Date;
      color: string;
      tipo: 'Hábito' | 'Tarea' | 'Evento;
    }

    Example of expected output (array of 3 IActividadSuggestion objects):
    [
      {
        "titulo": "Lavarse los dientes antes de acostarse",
        "descripcion": "Lavarse los dientes al menos durante 3 minutos antes de ir a la cama",
        "dia_semana": 1,
        "hora_inicio": "2025-05-30T10:00:00.000Z",
        "color": "#FF5733",
        "tipo": "Hábito",
      },
      {
        "titulo": "Sugerencia de Juego Exterior",
        "descripcion": "Juegos al aire libre en el parque",
        "dia_semana": 3,
        "hora_inicio": "2025-05-30T15:00:00.000Z",
        "color": "#33FF57",
        "tipo": "Evento",
      },
      {
        "titulo": "Clase de Música",
        "descripcion": "Clase de introducción a instrumentos musicales",
        "dia_semana": 5,
        "hora_inicio": "2025-05-30T17:00:00.000Z",
        "color": "#5733FF",
        "tipo": "Hábito",
      }
    ]
  `;
async generateAISuggestions(actividades: IActividad[]): Promise<IActividadSuggestion[]> {
    const activitiesJson = JSON.stringify(actividades);
    const fullPrompt = `${this.systemPromt}\n\nInput Activities:\n${activitiesJson}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20", 
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      let responseText = '';
      if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            responseText += part.text;
          }
        }
      } else {
        throw new InternalServerError("Fallo del servidor procesando la solicitud.", { error: "INTERNAL_SERVER_ERROR" });
      }

      const suggestedActivities: IActividadSuggestion[] = JSON.parse(responseText);

      return suggestedActivities;

    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      return [];
    }
  }
}