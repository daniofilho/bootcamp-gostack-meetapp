import './bootstrap';

import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
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

    if (process.env.NODE_ENV === 'production') {
      this.server.use(helmet());
    }

    this.server.use(express.json());

    if (process.env.NODE_ENV !== 'production') {
      this.server.use(cors()); // dessa forma, habilita acesso de qualquer lugar
    } else {
      this.server.use(
        cors({
          origin: process.env.FRONT_URL,
        })
      );
    }

    // permite exibir arquivos estáticos nessa rota
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    // Limite quantidade de acesso as rotas para evitar uso em excesso
    if (process.env.NODE_ENV === 'production') {
      this.server.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient({
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
            }),
            windowMs: 1000 * 60 * 15, // no intervalo de 15min
            max: 100, // permite X requisições
          }),
        })
      );
    }
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // Quando um middleware recebe 4 parâmetros, o express entende que é um middleware de tratamento de exceção
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json('Internal server error!');
    });
  }
}
export default new App().server;
