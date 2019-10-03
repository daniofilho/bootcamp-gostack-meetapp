import request from 'supertest';
import faker from 'faker';
import jwt from 'jsonwebtoken';

import app from '../../../src/app';

import User from '../../../src/app/models/User';

import authConfig from '../../../src/config/auth';

class UserHelper {
  constructor() {
    this.user = [];
  }

  get() {
    return this.user;
  }

  set(data) {
    this.user = data;
  }

  async generate() {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const resUser = await User.create(user);
    const user_id = resUser.id;

    this.set({
      ...user,
      id: user_id,
      token: await this.genToken({
        email: user.email,
        password: user.password,
      }),
    });

    return this.get();
  }

  async genToken({ email, password }) {
    const response = await request(app)
      .post('/sessions')
      .send({
        email,
        password,
      });

    return response.body.token;
  }
}

export default new UserHelper();
