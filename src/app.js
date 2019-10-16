import './bootstrap';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
    this.exeptionHandler();
  }

  middlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(helmet());
  }

  routes() {
    this.app.use(routes);
  }

  exeptionHandler() {
    this.app.use((err, req, res, next) => {
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    });
  }
}
export default new App().app;
