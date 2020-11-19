import express from 'express';
import cookieParser from 'cookie-parser';

// Rotas
import authRoutes from './routes/auth';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);

export default app;
