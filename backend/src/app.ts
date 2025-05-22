import express from 'express';
import cors from 'cors';
import { corsConfig } from './config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsConfig))

app.get('/', (_req, res) => {
  res.send('Hola mundo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor arrancado en el puerto: ${PORT}`));