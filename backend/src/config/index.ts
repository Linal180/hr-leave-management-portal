import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  cors: {
    origin: string;
    credentials: boolean;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
};

export default config;
