import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

// Rotas
import authRoutes from '../lib/routes/auth';
import drawRoutes from '../lib/routes/drawings';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: /^https:\/\/(www\.)?drawpixer(-git-.+\.diego-fidalgo)?\.vercel\.app$/
}));
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', drawRoutes);

export default app;
