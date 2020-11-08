import { Router } from 'express';
import authRoutes from './auth';

const routes = Router();

routes.use(authRoutes);

export default routes;
