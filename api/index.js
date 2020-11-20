import express from 'express';
import cookieParser from 'cookie-parser';

// Rotas
import authRoutes from './routes/auth';
import drawRoutes from './routes/drawings';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', drawRoutes);

export default app;
