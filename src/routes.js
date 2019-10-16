import { Router } from 'express';

import protectedRoutes from './app/middlewares/auth';

import AuthController from './app/controllers/AuthController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/', (req, res) =>
  res.json({
    message: 'Welcome',
  })
);

routes.post('/register', UserController.store);
routes.post('/auth/login', AuthController.store);
routes.post('/auth/forgot-password', AuthController.forgotPassword);

routes.use(protectedRoutes);

routes.get('/session', (req, res) => res.json(req.user));
export default routes;
