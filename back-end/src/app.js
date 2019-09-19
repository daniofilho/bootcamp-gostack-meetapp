import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import express from 'express';
import Youch from 'youch';
import * as Sentry from '@sentry/node';

import 'express-async-errors'; // must import before routes!

import sentryConfig from './config/sentry';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    if (process.env.NODE_ENV === 'development') {
      this.server.use(cors()); // dessa forma, habilitar acesso de qualquer lugar
    } else {
      this.server.use(
        cors({
          origin: process.env.FRONT_END_URL,
        })
      );
    }
    this.server.use(express.json());
    // permite exibir arquivos estáticos nessa rota
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json('Internal server error');
    });
  }
}
export default new App().server;