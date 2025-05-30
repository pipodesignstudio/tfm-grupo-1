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
    type: new Schema({ 
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
    }),
    required: false, 
    _id: false 
  },

  userAction: {
    type: new Schema({ 
      userId: { type: Number, required: true }, 
      action: { type: String, required: true },
    }),
    required: false, 
    _id: false 
  },
}, {
  timestamps: false,
  collection: 'logs'
});

const Log = mongoose.model<ILog>('Log', LogSchema);
export default Log;