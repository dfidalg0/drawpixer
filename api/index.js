import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Rotas
import authRoutes from '../lib/routes/auth';
import drawRoutes from '../lib/routes/drawings';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', drawRoutes);

export default app;
