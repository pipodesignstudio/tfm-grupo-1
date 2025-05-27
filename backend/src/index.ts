import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import {  corsConfig } from './config';
import { startServer } from './config/server';
import { errorHandler } from './middlewares';
import { NotFoundError } from './utils';
import apiRouter from './routes';
import apiDocsConfig from './config/api-docs.config';


const app = express();

app.use(cors(corsConfig))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocsConfig));


app.use('/api', apiRouter )

// Cualquier ruta que no coincida con las anteriores lanzará un error 404 personalizado en el error middleware
app.use((_, __, next) => {
  next(new NotFoundError());
});


app.use(errorHandler);

startServer();

export default app;
