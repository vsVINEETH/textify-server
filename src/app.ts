import express from 'express';
import cors from 'cors';
import router from './interfaces/routes/userRoutes';
import config from './gateways/config/config';
import { errorHandler } from './interfaces/middlewares/errorHandler';

const app = express();

app.use(cors(config.cors));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', router);

app.use(errorHandler);

export default app;