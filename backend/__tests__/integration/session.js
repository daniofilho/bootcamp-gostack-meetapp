import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';

import UserHelper from '../util/helpers/UserHelper';

// # User
describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  // # Token
  it('should be able to create a token', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.body).toHaveProperty('token');
  });

  // # User not exist
  it('should not be able to create token with inexistent user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'idont@exist.com',
        password: '123456',
      });
    expect(response.status).toBe(401);
  });

  // # Wrong Password
  it('should not be able to create token with wrong password', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '222',
      });
    expect(response.status).toBe(401);
  });

  // # Empty fields
  it('should be able to create a token without credentials', async () => {
    const response = await request(app).post('/sessions');

    expect(response.status).toBe(400);
  });

  // # No Password
  it('should not be able to create token without password', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
      });
    expect(response.status).toBe(400);
  });
});
