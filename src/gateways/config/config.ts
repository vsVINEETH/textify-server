import dotenv from 'dotenv';
import {Cors} from '../../../types/index'
dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    cors: Cors
};

const config: Config = {
    port: Number(process.env.PORT) || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
    cors: {
        origin: process.env.CLIENT_BASE_URL || 'http://localhost:3000',
        credentials: true,
        method: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
    },

};

export default config;