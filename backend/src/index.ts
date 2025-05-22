import express from 'express';
import cors from 'cors';
import { corsConfig } from './config';
import { startServer } from './config/server';




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsConfig))

app.get('/', (_req, res) => {
  res.send('Hola mundo');
});

startServer();

export default app;
