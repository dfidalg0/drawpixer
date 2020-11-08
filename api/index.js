import express from 'express';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);

export default app;
