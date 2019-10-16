import { Router } from 'express';

// # Brute Force protection
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import multer from 'multer';
import multerConfig from './config/multer';

// # Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FilesController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

// # Validators
import validateMeetupStore from './app/validators/MeetupStore';
import validateMeetupUpdate from './app/validators/MeetupUpdate';
import validateSubscriptionStore from './app/validators/SubscriptionStore';
import validateSessionStore from './app/validators/SessionStore';
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
const BruteForce = new Brute(bruteStore, {
  freeRetries: process.env.NODE_ENV === 'production' ? 2 : 9999999, // prevent protection on tests
});

// # Sign
routes.post('/users', validateUserStore, UserController.store);
routes.post(
  '/sessions',
  BruteForce.prevent,
  validateSessionStore,
  SessionController.store
);

// # Middleware
routes.use(authMiddleware);

// # Users
routes.put('/users', validateUserUpdate, UserController.update);

// # Files
routes.post('/files', upload.single('file'), FilesController.store);

// # Meetups
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', validateMeetupStore, MeetupController.store);
routes.put('/meetups/:id', validateMeetupUpdate, MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

// # Subscriptions
routes.post(
  '/subscriptions',
  validateSubscriptionStore,
  SubscriptionController.store
);
routes.get('/subscriptions', SubscriptionController.index);
routes.delete('/subscriptions/:id', SubscriptionController.delete);

export default routes;
