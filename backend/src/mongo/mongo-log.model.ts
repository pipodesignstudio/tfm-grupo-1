// src/models/Log.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  type: 'error' | 'userAction'; 
  timestamp: Date;
  error?: ILogErrorData;
  userAction?: IUserActionData;
}

export interface ILogErrorData {
  code?: string;
  message: string;
  stack?: string;
  details?: object; 
  request?: { 
    method?: string;
    url?: string;
    ip?: string;
    userId?: number; 
  };
}

export interface IUserActionData {
  userId: number; 
  action: string; 
}


const LogSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['error', 'userAction'] },
  timestamp: { type: Date, default: Date.now, required: true },

  error: {
    code: { type: String },
    message: { type: String, required: true },
    stack: { type: String },
    details: { type: Schema.Types.Mixed },
    request: {
      method: { type: String },
      url: { type: String },
      ip: { type: String },
      userId: { type: Number },
    },
  },

  userAction: {
    userId: { type: Number, required: true },
    action: { type: String, required: true },
  },
}, {
  timestamps: false, // Quiero que la fecha sea cuando se genera en el servidor, no cuando se guarda
  collection: 'logs'
});

const Log = mongoose.model<ILog>('Log', LogSchema);
export default Log;